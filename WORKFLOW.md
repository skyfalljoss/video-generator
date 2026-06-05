# Short Video Generator — Architecture & Workflow

> AI-powered platform that turns a series configuration (niche, voice, style, music) into a fully rendered short-form video (YouTube Shorts / TikTok / Reels), auto-publishes it, and notifies the user.

---

## 1. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, React 19, Server Components, Server Actions) |
| Language | TypeScript 5 |
| Auth & Billing | Clerk (with `has({ plan })` for subscription tiers) |
| Database | Supabase (Postgres + Storage + RLS using Clerk JWT `sub`) |
| Background Jobs | Inngest (durable, step-based workflows with retries) |
| AI — Script | Google Gemini 2.5 Flash (`@google/genai`, structured JSON output) |
| AI — Voice | Deepgram TTS (Aura models) |
| AI — Captions | Deepgram STT (Nova-2, word-level timestamps) |
| AI — Images | Replicate (Google `imagen-4`) → fallback Cloudflare Workers AI |
| Video Render | Remotion 4 + Remotion Lambda (AWS) |
| Email | Resend + React Email |
| Publishing | YouTube Data API v3 (OAuth2 via `googleapis`) |
| Payments | Stripe (webhook-driven) |
| UI | Tailwind v4, shadcn/ui, Radix, Base UI |
| Edge | Cloudflare Worker (image-gen fallback) |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                           │
│   Landing • Sign-in (Clerk) • Dashboard • Create-Series Wizard (5-step) │
└──────────────────┬──────────────────────────────────────────────────────┘
                   │
                   ▼ Server Actions / Route Handlers
┌─────────────────────────────────────────────────────────────────────────┐
│                       Next.js 16 (App Router)                           │
│  • middleware.ts → Clerk route protection                               │
│  • app/actions/* → Server Actions (RSC mutations)                       │
│  • app/api/* → Webhooks, Inngest, Auth callbacks                        │
│  • lib/subscription.ts → Plan gating via Clerk has({plan})              │
└──────┬──────────────────────────────┬──────────────────────────┬────────┘
       │                              │                          │
       │ insert series_projects       │ send "video/generate"    │
       ▼                              ▼                          ▼
┌──────────────┐         ┌─────────────────────┐         ┌──────────────┐
│   Supabase   │◄────────┤  Inngest Function   │         │ Clerk / Svix │
│ Postgres+RLS │         │  generateVideo      │         │  webhooks    │
│   Storage    │         │  (9 durable steps)  │         └──────────────┘
└──────▲───────┘         └──┬──────────────┬───┘
       │                    │              │
       │   step.run()       │              │
       │   incremental      ▼              ▼
       │   writes      ┌─────────┐   ┌──────────┐
       │               │ Gemini  │   │ Deepgram │
       │               │ Replicate│  │  TTS+STT │
       │               │ CF Worker│  └──────────┘
       │               └────┬────┘
       │                    ▼
       │              ┌──────────────────┐
       │              │ Remotion Lambda  │
       │              │ (AWS, h264, mp4) │
       │              └────┬─────────────┘
       │                   │
       │   final_video_url │
       └───────────────────┤
                           ▼
              ┌─────────────────────────┐
              │ Resend ✉  + YouTube API │
              └─────────────────────────┘
```

---

## 3. Directory Layout (relevant pieces)

| Path | Responsibility |
|------|----------------|
| [middleware.ts](middleware.ts) | Clerk route protection — public vs. authenticated |
| [app/layout.tsx](app/layout.tsx) | Root layout, ClerkProvider |
| [app/dashboard/](app/dashboard) | Authenticated app shell (series, videos, billing, settings) |
| [app/dashboard/create-series/](app/dashboard/create-series) | 5-step wizard to configure a new series |
| [app/actions/video.ts](app/actions/video.ts) | Server Actions for video CRUD |
| [app/actions/user.ts](app/actions/user.ts) | Server Actions for user/profile |
| [app/api/inngest/](app/api/inngest) | Inngest serve handler |
| [app/api/webhooks/clerk/](app/api/webhooks/clerk) | Clerk → Supabase user sync (Svix verified) |
| [app/api/webhooks/stripe/](app/api/webhooks/stripe) | Stripe billing events |
| [app/api/auth/](app/api/auth) | YouTube OAuth callback |
| [lib/inngest/client.ts](lib/inngest/client.ts) | Inngest singleton client |
| [lib/inngest/functions.ts](lib/inngest/functions.ts) | The `generateVideo` workflow (9 steps) |
| [lib/subscription.ts](lib/subscription.ts) | Plan tiers + quota enforcement |
| [lib/supabase.ts](lib/supabase.ts) | Shared Supabase factories |
| [utils/supabase/](utils/supabase) | `client.ts` / `server.ts` / `admin.ts` / `middleware.ts` |
| [remotion/Root.tsx](remotion/Root.tsx) | Remotion composition registration |
| [remotion/MainVideo.tsx](remotion/MainVideo.tsx) | Per-frame video composition (images + audio + captions) |
| [components/dashboard/wizard/](components/dashboard/wizard) | `Step1Format` … `Step5Detail` |
| [cloudflare-worker/worker.js](cloudflare-worker/worker.js) | Free-tier image generation fallback |
| [supabase_schema.sql](supabase_schema.sql) | Postgres schema + RLS policies |

---

## 4. Data Model

### `users`
Mirrors Clerk users for joins/reporting. Synced via Clerk webhook.

### `series_projects`
A reusable series configuration produced by the 5-step wizard.
Key columns: `format`, `niche`, `custom_topic`, `aspect_ratio`, `language`, `voice`, `music[]`, `video_style`, `caption_style`, `duration`, `platforms[]`, `status`.

### `video_generations`
One row per video produced from a series. Filled **incrementally** by Inngest steps so the UI can show progress.
Key columns: `series_id`, `title`, `script`, `audio_url`, `captions` (jsonb of word-level timestamps), `image_urls[]`, `final_video_url`, `status` (`processing | completed | failed`), `error_message`.

### `social_connections`
OAuth tokens per `(user_id, platform)` — currently YouTube. Refresh tokens persisted, access tokens updated on refresh.

**RLS pattern:** every table uses `(auth.jwt() ->> 'sub') = user_id` so a Clerk-issued JWT drives row-level access.

---

## 5. The Core Workflow — `generateVideo` (Inngest)

Triggered by event `video/generate` with payload `{ seriesId, videoId }`.
Each numbered block is a `step.run(...)` — Inngest makes them **durable, idempotent, individually retried, and resumable**.

| # | Step | Service | Output written |
|---|------|---------|----------------|
| 1 | `fetch-series-data` | Supabase (admin client) | — |
| 2 | `generate-script` | Gemini 2.5 Flash (structured JSON schema) | `title`, `script` |
| 3 | `generate-voice` | Deepgram TTS → upload to Supabase Storage | `audio_url` |
| 4 | `generate-captions` | Deepgram STT (Nova-2, utterances) | `captions` (word timings) |
| 5 | `generate-images` | Replicate `imagen-4` → fallback Cloudflare Worker | `image_urls[]` |
| 6 | `render-video` | Remotion Lambda (poll `getRenderProgress`) | `final_video_url` |
| 7 | `save-generated-video` | Supabase finalize | `status='completed'` |
| 8 | `send-email-notification` | Resend + React Email | — (best-effort) |
| 9 | `publish-to-youtube` | YouTube Data API v3 (OAuth refresh) | — (best-effort) |

**Resilience strategy:**
- `retries: 1` so failed generations don't burn paid API credits.
- `onFailure` handler marks `video_generations.status = 'failed'` with the error message.
- Image generation has provider fallback (Replicate → Cloudflare).
- Steps 8 & 9 swallow errors (best-effort) so a Resend/YouTube outage doesn't waste a successful render.
- All large secrets only used inside Inngest (server-only) with `SUPABASE_SERVICE_ROLE_KEY` bypassing RLS.

---

## 6. Request Lifecycle — "User clicks Generate"

```
User → Wizard Step 5 → Server Action
  ├─ getUserSubscriptionTier()  via Clerk has({ plan })
  ├─ checkSeriesLimit() / checkVideoTokenLimit()
  ├─ INSERT series_projects (status='pending')
  ├─ INSERT video_generations (status='processing')
  └─ inngest.send({ name: 'video/generate', data: { seriesId, videoId } })
        │
        ▼
Inngest worker → 9 durable steps (see §5)
        │
        ▼
Dashboard polls /api/... or revalidates RSC → sees incremental updates
        │
        ▼
On completion: Resend email + optional YouTube publish
```

---

## 7. Design Patterns in Use

### 7.1 Server Actions (Command pattern over RSC)
`app/actions/*.ts` expose async mutations callable directly from client components. Each one re-authenticates with `await auth()` and never trusts a client-supplied `userId`.

### 7.2 Repository / Data-Access Split
Three Supabase factories enforce intent:
- `utils/supabase/client.ts` — browser (anon key + Clerk JWT)
- `utils/supabase/server.ts` — RSC/Server Actions (cookies-aware)
- `utils/supabase/admin.ts` — service-role (background jobs only)

### 7.3 Saga / Step Function (Inngest)
The 9-step `generateVideo` is a saga: each `step.run` is independently retried, memoised, and resumable. Failures route to a compensating `onFailure` that updates the DB state.

### 7.4 Strategy + Fallback (Image generation)
Primary strategy = Replicate. On any throw, swap to the Cloudflare Worker strategy. Same `Buffer` interface downstream, so the upload path doesn't change.

### 7.5 Wizard / Multi-step Form
`CreateSeriesWizard.tsx` owns aggregate state and renders `Step1Format` → `Step5Detail`. Children are presentational; the wizard is the container (container/presentational split).

### 7.6 Policy-Based Authorization
- **Edge:** `clerkMiddleware` + `createRouteMatcher` for route gating.
- **Database:** Postgres RLS via `auth.jwt() ->> 'sub'`.
- **Application:** `lib/subscription.ts` enforces plan quotas using `auth().has({ plan })`.

### 7.7 Webhook-Driven Sync (Observer pattern)
- Clerk → `/api/webhooks/clerk` (Svix-verified) → upsert `users`.
- Stripe → `/api/webhooks/stripe` → billing reconciliation.
- Inngest → `/api/inngest` → durable workflow execution.

### 7.8 Incremental Persistence
Each generation step writes its partial output to `video_generations` immediately, so the UI can render progressive state and a partial failure leaves a usable forensic record.

### 7.9 Component Composition (shadcn/ui)
UI is a wide library of small primitives in `components/ui/` composed by feature components in `components/dashboard/` and `components/landing/`. High cohesion, small files.

### 7.10 Lazy Server-Only Imports
Heavy SDKs (`@google/genai`, `@deepgram/sdk`, `replicate`, `@remotion/lambda/client`, `googleapis`, `resend`) are dynamically `await import()`-ed inside Inngest steps. Keeps the Next.js server bundle small and avoids cold-start cost on unrelated routes.

### 7.11 Declarative Video as React (Remotion)
`remotion/MainVideo.tsx` is a pure function of `(audioUrl, captions, imageUrls, bgAudioUrl, captionStyle)` over frames. Frame-driven rendering = deterministic, scrubable, and parallelisable via Lambda (`framesPerLambda: 30`).

---

## 8. Subscription / Quota Flow

```
auth().has({ plan: 'unlimited' }) → tier='unlimited'  → series=∞,  tokens=∞
auth().has({ plan: 'basic' })     → tier='basic'      → series=3,  tokens=∞
fallback                          → tier='free'       → series=1,  tokens=5/day
```

Quota checks (`checkSeriesLimit`, `checkVideoTokenLimit`) run **before** inserting a row or dispatching the Inngest event, so paid APIs are never called for over-quota users.

---

## 9. Security Notes (relevant in code)

- **JWT-driven RLS**: Clerk JWT template surfaces `sub` to Supabase; every policy compares it to `user_id`.
- **Service-role isolation**: `admin.ts` / `createAdminClient()` only used in `lib/inngest/*` and a few server actions — never reaches the browser.
- **Webhook signature verification**: Clerk uses Svix HMAC; Stripe uses its own signature scheme.
- **YouTube tokens**: Access token refreshed via `oauth2Client.getAccessToken()` immediately before upload; new value persisted to `social_connections`.
- **Auth**: All non-public routes protected by `auth.protect()` in middleware; public route list is explicit and minimal.
- **Default privacy**: YouTube uploads default to `privacyStatus: "private"` for safety.

---

## 10. Environment Variables (high-signal)

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | DB + Storage |
| `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_*` | Auth + plan gating |
| `GEMINI_API_KEY` | Script generation |
| `DEEPGRAM_API_KEY` | TTS + STT |
| `REPLICATE_API_TOKEN` | Image generation (primary) |
| `CLOUDFLARE_WORKER_URL`, `CLOUDFLARE_WORKER_API_KEY` | Image fallback |
| `REMOTION_AWS_ACCESS_KEY_ID`, `REMOTION_AWS_SECRET_ACCESS_KEY`, `REMOTION_AWS_REGION`, `REMOTION_SITE_NAME`, `REMOTION_FUNCTION_NAME` | Lambda render |
| `RESEND_API_KEY` | Email notifications |
| `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL` | YouTube OAuth |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Payments |

---

## 11. Local Development

```powershell
# Terminal 1 — Next.js
pnpm dev          # or: npm run dev

# Terminal 2 — Inngest Dev Server (required for background jobs)
npm run dev:inngest
```

The Inngest dev server proxies `http://localhost:3000/api/inngest` and provides a UI to replay/inspect each step of the `generateVideo` saga.

---

## 12. Extension Points

- **New publishing target** (TikTok, Instagram): add row to `social_connections`, OAuth route under `app/api/auth/<platform>`, and a new step at the end of `generateVideo`.
- **New caption style**: extend the `captionStyle` switch in `remotion/MainVideo.tsx`.
- **New image provider**: add another `catch` fallback in step 5 of `generateVideo`.
- **New plan tier**: add to `PLAN_LIMITS` in `lib/subscription.ts` and the matching Clerk plan slug.
