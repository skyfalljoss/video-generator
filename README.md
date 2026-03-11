# AI Short Video Generator

An automated SaaS platform that generates short-form viral videos (like TikToks, YouTube Shorts, and Instagram Reels) entirely using AI. The application features a multi-step creation wizard where users can define their video series by selecting their niche, voice, music, and visual styles. From there, the system autonomously scripts, narrates, illustrates, and assembles the video in the background.

## 🚀 Features

- **Multi-Step Series Wizard**: Intuitive UI to configure a video series (niche, language, voice, music, and visual presentation).
- **Automated Scripting**: Uses Google Gemini to write highly engaging, viral-optimized scripts and image generation prompts.
- **AI Voiceovers & Captions**: Leverages Deepgram for natural sounding text-to-speech and perfectly timed word-level styling/captions.
- **Dynamic Image Generation**: Uses Replicate (with fallback APIs) to generate matching scene visuals based on the script.
- **Programmatic Video Synthesis**: Uses Remotion to compose the audio, images, captions, and background music into a final, downloadable MP4.
- **Background Orchestration**: Long-running generation pipelines are reliably managed via Inngest workflows.
- **Tiered Subscriptions & Auth**: Secured with Clerk authentication with paid plans (Basic, Unlimited) managed via Stripe.

## 🛠️ Tech Stack & Techniques

### Core Frameworks

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Shadcn/Radix UI
- **Database & Storage**: [Supabase](https://supabase.com/)

### The Automation Pipeline (Technique)

The platform essentially glues together several best-in-class AI models using a robust background job runner. Here is how a video is generated under the hood:

1. **Trigger**: User completes the series wizard. An Inngest event (`video/generate`) is fired.
2. **Generative Text**: `GoogleGenAI` (Gemini 2.5 Flash) takes the user's prompt and generates a structured JSON payload containing the script, title, and exactly 4-6 scene prompts.
3. **Audio Generation**: Text is sent to `Deepgram` to generate a high-quality human-like TTS `.wav` audio file which is saved to Supabase Storage.
4. **Caption Timing**: The generated audio is analyzed to extract exact word-level timestamp alignments for animated captions.
5. **Image Generation**: Scene prompts are sent to `Replicate` (or a fallback API) to generate the visual track of the video.
6. **Stitching & Rendering**: Finally, all assets are passed to `Remotion` (via AWS Lambda / Remotion CLI), whichprogrammatically codes the video layout and renders the final MP4 with kinetic typography captions.

## 🚦 Instructions to Run Properly

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- npm, pnpm, or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory. You will need API keys for the following services (refer to `.env.local` or `.env` templates if available):

- **Clerk**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Inngest**: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
- **Google Gen AI**: `GEMINI_API_KEY`
- **Deepgram**: `DEEPGRAM_API_KEY`
- **Replicate**: `REPLICATE_API_TOKEN`
- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### 3. Setup Database

Execute the `supabase_schema.sql` in your interconnected Supabase instance SQL editor to create the required tables and Row Level Security (RLS) policies.

### 4. Run the Background Job Server (Inngest)

Because video generation involves long-running AI tasks, you must start the Inngest local dev server alongside your app to process background queues:

```bash
npx inngest-cli@latest dev
```

### 5. Start the Development Server

In a separate terminal, start Next.js:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application!
