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

### Authentication & Database
- **Clerk** - User authentication and management
- **Supabase** - PostgreSQL database and file storage
- **Row Level Security (RLS)** - Data protection policies

### AI & Media Services
- **Google Gemini 2.5 Flash** - Script and content generation
- **Deepgram API** - Text-to-speech and transcription
- **Replicate** - AI image generation (Imagen 4)
- **Cloudflare Workers** - Fallback image generation
- **Inngest** - Workflow orchestration for video generation

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

For local development with background job processing, run Inngest in a separate terminal:

```bash
# Install Inngest CLI globally (if not already installed)
npm install -g inngest-cli

# Start Inngest dev server
inngest dev
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

### Generate a Video

1. **Trigger Generation** - User clicks "Generate" on a series
2. **Background Job** - Inngest processes:
   - Generate script via Gemini
   - Create voice via Deepgram TTS
   - Generate caption file via transcription
   - Create images via Replicate (or Cloudflare fallback)
   - Compose final video (handled by separate service)
3. **Storage** - Assets stored in Supabase Storage
4. **Database Update** - Video generation record updated with URLs and status

## 🔑 Environment Variables Explained

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Supabase key | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `WEBHOOK_SECRET` | Clerk webhook signing secret | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `DEEPGRAM_API_KEY` | Deepgram API key | Yes |
| `REPLICATE_API_TOKEN` | Replicate API token | Yes |
| `CLOUDFLARE_WORKER_URL` | Cloudflare Worker URL | No (fallback) |
| `CLOUDFLARE_WORKER_API_KEY` | Cloudflare Worker API key | No (fallback) |

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
