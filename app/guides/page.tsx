import Link from "next/link";
import {
  PlusCircle, Tv, Film, Settings2, Zap, CheckCircle2, ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const steps = [
  {
    number: "01",
    icon: <PlusCircle className="h-6 w-6 text-indigo-600" />,
    title: "Create a Series",
    description: "A Series is your content channel — it defines the style, voice, niche, and target platform for all videos generated under it.",
    bullets: [
      'Click "Create New Series" in the sidebar or dashboard',
      "Choose a niche (e.g. Facts, Horror, Finance, Motivation)",
      "Pick your language and AI voice",
      "Select background music and visual style",
      "Name your series and save it",
    ],
    tip: "Be specific with your niche. 'Scary facts about ocean creatures' will produce more consistent, viral content than just 'facts'.",
  },
  {
    number: "02",
    icon: <Zap className="h-6 w-6 text-violet-600" />,
    title: "Generate a Video",
    description: "Once your Series is saved, generating a video is one click. The AI handles the full pipeline automatically.",
    bullets: [
      'Open your Series and click the "Generate" button',
      "The AI writes a unique script for your niche",
      "A voiceover is recorded using your chosen AI voice",
      "Matching images are generated automatically",
      "Captions are added in your selected style",
      "The final video is rendered and saved to your library",
    ],
    tip: "Generation takes 3–8 minutes. You'll get an email notification and an in-app badge when it's done.",
  },
  {
    number: "03",
    icon: <Film className="h-6 w-6 text-pink-600" />,
    title: "Review Your Video",
    description: "After generation, visit the Videos page to preview your content before publishing.",
    bullets: [
      'Click "Videos" in the sidebar',
      "Find your video — use the series filter or the search bar",
      "Preview the video directly in the browser",
      "Download it or check the auto-publish status",
    ],
    tip: "Use the search bar to type any keyword and filter your videos instantly. Press Enter to search across all your content.",
  },
  {
    number: "04",
    icon: <Tv className="h-6 w-6 text-green-600" />,
    title: "Auto-Publish to YouTube",
    description: "Connect your YouTube account and V Gen will upload your video automatically after generation.",
    bullets: [
      "Go to Settings → Integrations and connect your YouTube account",
      "When creating or editing a Series, enable YouTube as a platform",
      "After generation, the video is privately uploaded to your channel",
      "Review it in YouTube Studio and change visibility when ready",
    ],
    tip: "Videos are uploaded as Private by default so you can review before making them public.",
  },
  {
    number: "05",
    icon: <Settings2 className="h-6 w-6 text-amber-600" />,
    title: "Manage & Iterate",
    description: "V Gen is designed for volume. Generate multiple videos from the same Series to build a content library.",
    bullets: [
      "Each Series can generate unlimited unique videos (based on your plan)",
      "Edit your Series settings anytime to change voice, style, or custom prompts",
      "Check your plan limits in Billing",
      "Upgrade to Basic or Unlimited for more generations and auto-publishing",
    ],
    tip: "The best results come from running 5–10 videos per series before deciding what niche works for your audience.",
  },
];

export default function GuidesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-600 font-medium">Getting Started Guide</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Getting Started with V Gen
            </h1>
            <p className="mt-3 text-zinc-500 text-lg max-w-2xl">
              Everything you need to go from zero to publishing your first AI-generated short video. Follow these 5 steps in order.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-[52px] top-full h-8 w-px bg-zinc-200" />
                )}
                <div className="flex items-start gap-5">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 shadow-sm">
                      {step.icon}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-300 tracking-widest">{step.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-zinc-900 mb-1">{step.title}</h2>
                    <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{step.description}</p>
                    <ul className="space-y-2 mb-5">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-zinc-700">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
                      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">💡 Pro Tip</p>
                      <p className="text-sm text-indigo-800 leading-relaxed">{step.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-center shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Ready to make your first video?</h3>
            <p className="text-indigo-100 text-sm mb-5">It takes less than 2 minutes to set up your first Series.</p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              Get Started Free
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
