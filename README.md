# Video Generator

An AI-powered platform for generating viral short-form videos (YouTube Shorts, TikTok) automatically. Simply describe your topic, and the platform handles script writing, voice generation, image creation, and video composition.

## 🚀 Features

- **AI Script Generation** - Uses Google Gemini to create engaging, viral-worthy scripts
- **Text-to-Speech** - Deepgram integration for natural voice generation in multiple languages
- **AI Image Generation** - Creates matching visuals using Replicate with Cloudflare Workers fallback
- **Automatic Captions** - Deepgram transcription with word-level timing for captions
- **Series Management** - Create series with customizable parameters (duration, style, language, music)
- **User Authentication** - Clerk-powered user management
- **Background Processing** - Inngest for reliable async job handling
- **Cloud Storage** - Supabase for secure file storage and database

## 🛠️ Tech Stack

### Frontend & Backend

- **Next.js 16** - React framework with API routes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Authentication, Database & Payments

- **Clerk** - User authentication and management
- **Supabase** - PostgreSQL database and file storage
- **Row Level Security (RLS)** - Data protection policies

### AI & Media Services

- **Google Gemini 2.5 Flash** - Script and content generation
- **Deepgram API** - Text-to-speech and transcription
- **Replicate** - AI image generation (Imagen 4)
- **Cloudflare Workers** - Fallback image generation
- **Inngest** - Workflow orchestration for video generation
- **Remotion** - Programmatic video composition and MP4 rendering

### UI Components

- **Radix UI** - Unstyled, accessible components
- **Shadcn UI** - Pre-built component library
- **Lucide Icons** - Icon library
- **Sonner** - Toast notifications

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm/yarn
- **Git** for version control
- **Accounts and API Keys:**
  - [Supabase](https://supabase.com) - Database & storage
  - [Clerk](https://clerk.com) - Authentication
  - [Google Cloud](https://cloud.google.com) - Gemini API key
  - [Deepgram](https://deepgram.com) - Speech API
  - [Replicate](https://replicate.com) - Image generation
  - [Cloudflare](https://workers.cloudflare.com) - Workers setup (optional fallback)
  - [Inngest](https://inngest.com) - Workflow management (optional, for local testing use webhook)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd video-generator
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

Visit [Supabase](https://supabase.com) and:

- Create a new project
- Copy your `URL` and `Anon Key` from settings
- Run the schema migration:

```bash
# Using Supabase CLI (install from https://supabase.com/docs/guides/cli)
supabase db push supabase_schema.sql
```

Or manually paste the contents of `supabase_schema.sql` into the SQL editor in Supabase dashboard.

### 4. Set Up Clerk Authentication

Visit [Clerk Dashboard](https://dashboard.clerk.com):

- Create a new application
- Go to API Keys and copy `Publishable Key` and `Secret Key`
- Set up Sign In and Sign Up URLs in Clerk settings (use `http://localhost:3000` for local development)

### 5. Configure Environment Variables

Copy the template and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys:

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Webhook Secret (from Clerk)
WEBHOOK_SECRET=your_webhook_secret

# AI/3rd-party service credentials
GEMINI_API_KEY=your_google_gemini_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
REPLICATE_API_TOKEN=your_replicate_api_token

# Cloudflare Worker for fallback image generation
CLOUDFLARE_WORKER_URL=your_worker_url
CLOUDFLARE_WORKER_API_KEY=your_worker_api_key

# Inngest (local dev)
INNGEST_DEV=1
```

### 6. Run Database Migrations (Optional)

If you have Supabase CLI installed:

```bash
npx supabase link --project-ref your_project_ref
npx supabase start
```

## 🚀 Running the Project

### Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

Features hot-reload - edit `app/page.tsx` or any component and see changes instantly.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Background Jobs (Inngest)

For local development with background job processing, you must run the Inngest local dev server to handle the long-running AI video generation pipelines.

Run this in a **separate terminal** alongside your app:

```bash
npx inngest-cli@latest dev
```

This will start the Inngest dashboard at [http://localhost:8288](http://localhost:8288) where you can monitor and trigger background jobs.

## 📁 Project Structure

```
video-generator/
├── app/
│   ├── actions/              # Server actions for data mutations
│   ├── api/                  # API routes (Deepgram TTS, Inngest, webhooks)
│   ├── dashboard/            # Protected dashboard routes
│   │   ├── create-series/    # Video series creation wizard
│   │   └── videos/           # Video list and management
│   ├── sign-in/              # Clerk sign-in page
│   ├── sign-up/              # Clerk sign-up page
│   ├── layout.tsx            # Root layout with Clerk provider
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   ├── dashboard/            # Dashboard UI components
│   │   └── wizard/           # Series creation wizard steps
│   ├── landing/              # Landing page components
│   └── ui/                   # Reusable UI components (from shadcn)
├── hooks/                    # Custom React hooks
├── lib/
│   ├── supabase/             # Supabase client wrappers
│   ├── inngest/              # Inngest workflow definitions
│   └── utils.ts              # Utility functions
├── utils/
│   └── supabase/             # Supabase helpers (admin, client, server)
├── public/
│   ├── video-style/          # Video style assets
│   └── voice/                # Voice sample assets by language
├── middleware.ts             # Clerk authentication middleware
├── supabase_schema.sql       # Database schema
└── .env.local                # Environment variables (local)
```

## 🎯 Key Workflows

### Create a Video Series

1. **User Sign Up** - Authenticate via Clerk
2. **Dashboard** - Navigate to "Create Series"
3. **Series Wizard** - Fill out:
   - Step 1: Format & niche/topic
   - Step 2: Voice & language
   - Step 3: Background music
   - Step 4: Visual style
   - Step 5: Duration & publish schedule
4. **Series Saved** - Series data stored in Supabase

### Generate a Video (The AI Composition Technique)

The core technique of this platform relies on an intensive pipelined orchestration via **Inngest**, sequentially calling specialized API models and then assembling the final layout context via **Remotion**:

1. **Trigger Generation** - User interacts with the UI, which queues an Inngest background event (`video/generate`).
2. **Generative Scripting** - `GoogleGenAI` (Gemini 2.5 Flash) is prompted with the series context (niche, length, specific requested visual style) and generates a structured JSON payload defining the VoiceOver script and a specific number of high-quality image generation prompts (e.g. 4-6 scenes).
3. **Voice Over Synthesis** - `Deepgram` API converts the script into a high-quality human-sounding `.wav` TTS file.
4. **Caption Timing Array** - Deepgram's text API analyzes the exact audio output to generate a JSON array of timestamped words. These perfectly timed bounds trigger the bouncing, animated kinetic typography during playback.
5. **Generative Visuals** - Scene prompts are concurrently sent to `Replicate` (`Imagen 4`) or your `Cloudflare Worker` API fallback to generate engaging portrait illustrations.
6. **Programmatic Composition** - The generated Audio, timed Captions JSON, array of returned Illustration URLs, chosen background music, and user-select visual overlay configs are fed as configuration props to **Remotion**. Remotion programmatically computes styling bounds, applies React component logic natively, and statically builds out a high-framerate final rendering of the `.MP4` video exactly based on those generated assets.
7. **Asset Sync & DB Store** - Final assets (video MP4, raw audio) are synchronized into your Supabase Storage buckets, and the `video_generations` postgres table is updated so the final viral video appears instantly on the user's dashboard!

## 🔑 Environment Variables Explained

| Variable                            | Purpose                      | Required      |
| ----------------------------------- | ---------------------------- | ------------- |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase project URL         | Yes           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Public Supabase key          | Yes           |
| `SUPABASE_SERVICE_ROLE_KEY`         | Admin Supabase key           | Yes           |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key             | Yes           |
| `CLERK_SECRET_KEY`                  | Clerk secret key             | Yes           |
| `WEBHOOK_SECRET`                    | Clerk webhook signing secret | Yes           |
| `GEMINI_API_KEY`                    | Google Gemini API key        | Yes           |
| `DEEPGRAM_API_KEY`                  | Deepgram API key             | Yes           |
| `REPLICATE_API_TOKEN`               | Replicate API token          | Yes           |
| `CLOUDFLARE_WORKER_URL`             | Cloudflare Worker URL        | No (fallback) |
| `CLOUDFLARE_WORKER_API_KEY`         | Cloudflare Worker API key    | No (fallback) |

## 🐛 Troubleshooting

### "Missing environment variables" Error

Ensure all required variables are set in `.env.local`. Check that:

- Keys are correctly copied (no trailing spaces)
- URLs don't have extra slashes
- Service role key is the admin key, not the anon key

### Deepgram API Errors

- Verify `DEEPGRAM_API_KEY` is valid
- Check Deepgram account has credits
- Ensure voice model names are correct (e.g., `aura-asteria-en`)

### Replicate Image Generation Fails

- Check `REPLICATE_API_TOKEN` validity
- Verify account has credits
- Cloudflare Worker fallback will be used if Replicate fails

### Clerk Authentication Not Working

- Ensure redirect URLs are configured in Clerk dashboard
- Check that `WEBHOOK_SECRET` matches Clerk dashboard value
- Clear browser cookies and try again

### Database Connection Issues

- Verify Supabase URL and keys are correct
- Check network connectivity
- Ensure RLS policies are properly set up

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Google Gemini API](https://ai.google.dev)
- [Deepgram API](https://developers.deepgram.com)
- [Replicate API](https://replicate.com/docs)
- [Inngest Documentation](https://www.inngest.com/docs)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
