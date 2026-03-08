import Link from "next/link";
import { ChevronRight, Lightbulb, Copy, Sparkles } from "lucide-react";

const tips = [
  {
    title: "Start with a strong hook",
    body: "The first 2 seconds determine if someone swipes. Your script should open with a question, a shocking fact, or a bold claim — never a greeting or slow intro.",
    example: 'Hook example: "99% of people don\'t know this can kill you while you sleep…"',
  },
  {
    title: "Keep it tight — one idea per video",
    body: "Short-form videos work best when they focus on a single, clear idea. Don't try to cover multiple facts or points. Pick one angle and go deep on it.",
    example: 'Instead of "5 facts about sharks" try "The one shark attack stat that scientists won\'t talk about."',
  },
  {
    title: "Use the custom prompt field wisely",
    body: 'In the Series setup, the "Custom Instructions" field is your secret weapon. Add specific tone, audience, and style instructions here to get much more targeted scripts.',
    example: 'Custom prompt: "Write in a conspiratorial, mysterious tone. The audience is 18–24 year olds who love Reddit-style content. End with a cliffhanger."',
  },
  {
    title: "Describe your visuals in the niche",
    body: "The AI generates image prompts automatically, but you can guide the visual style by describing it in your niche or custom prompt. Mention colors, mood, or specific settings.",
    example: 'Include in custom prompt: "Images should be dark, cinematic, moody — like a thriller movie. No text in images. Dramatic lighting."',
  },
  {
    title: "Match the script pace to the voice",
    body: "Faster voices sound energetic but need shorter sentences. Slower voices suit dramatic or educational content. Test a few voice options against your niche.",
    example: "For horror content, use a slower, deeper voice. For motivation, use an energetic, faster voice.",
  },
  {
    title: "End with a hook, not a goodbye",
    body: 'Skip "thanks for watching". Instead end with a question, a teaser for the next video, or a call to action that creates curiosity.',
    example: '"But that\'s only half the story… follow for the part they tried to hide."',
  },
];

const prompts = [
  {
    category: "Horror / Creepy Facts",
    color: "bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    examples: [
      {
        label: "Ocean Horrors",
        prompt: "Scary and unknown facts about the deep ocean that sound fake but are real. Mysterious, menacing tone. Target audience: 16–30 year olds. Make it feel like a horror documentary. End with something that makes the viewer uncomfortable.",
      },
      {
        label: "Creepy History",
        prompt: "A dark historical event or forgotten fact that most people don't know. Present it like a mystery being uncovered. Ominous, slow-burn tone. Short, punchy sentences.",
      },
    ],
  },
  {
    category: "Motivation / Self Improvement",
    color: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    examples: [
      {
        label: "Daily Habits",
        prompt: "One underrated daily habit that high-performers use but never talk about publicly. Energetic, direct, no-fluff tone. Target young professionals aged 18–35. Include a stat or reference to make it credible.",
      },
      {
        label: "Mindset Shift",
        prompt: "A powerful mindset reframe that changes how people think about failure or success. Conversational, authentic tone. Should feel like advice from a mentor, not a lecture. End with a challenge for the viewer.",
      },
    ],
  },
  {
    category: "Finance / Money",
    color: "bg-green-50 dark:bg-green-950/40 border-green-100 dark:border-green-900",
    badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    examples: [
      {
        label: "Hidden Money Trick",
        prompt: "A little-known financial trick or loophole that most middle-class people don't use. Simple, accessible language. Target audience: 22–40 year olds trying to build wealth. Start with a relatable problem, then deliver the insight.",
      },
      {
        label: "Passive Income Myth",
        prompt: "Debunk a common myth about passive income or investing. Slightly contrarian, confident tone. Back it up with logic. End with a practical action the viewer can take today.",
      },
    ],
  },
  {
    category: "Fascinating / Did You Know",
    color: "bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    examples: [
      {
        label: "Science Fact",
        prompt: "A mind-blowing science or nature fact that sounds impossible but is completely true. Enthusiastic, wonder-filled tone. Use simple language — no jargon. End with a question that makes the viewer want to look it up.",
      },
      {
        label: "History Secret",
        prompt: "A surprising historical fact that was deliberately kept out of school textbooks. Tone: slightly conspiratorial but grounded in fact. Short scenes, fast pacing. Hook in the first sentence.",
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      title="Copy prompt"
      className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
    >
      <Copy className="h-3.5 w-3.5" />
    </button>
  );
}

export default function ScriptTipsPage() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
        <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-zinc-600 font-medium">Script Writing Tips</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Script Writing Tips & Example Prompts
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl">
          Get better AI videos by writing smarter prompts. Copy the examples below directly into your Series custom instructions field.
        </p>
      </div>

      {/* Tips section */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Writing Tips</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{tip.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">{tip.body}</p>
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 px-3 py-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">{tip.example}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prompts section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Ready-to-Use Prompts</h2>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Copy any prompt below and paste it into the <strong>Custom Instructions</strong> field when creating or editing a Series. Adjust details to fit your channel.
        </p>

        <div className="space-y-8">
          {prompts.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cat.badge}`}>
                  {cat.category}
                </span>
              </div>
              <div className="space-y-4">
                {cat.examples.map((ex) => (
                  <div
                    key={ex.label}
                    className={`rounded-2xl border p-5 ${cat.color}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {ex.label}
                      </span>
                      <CopyButton text={ex.prompt} />
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono bg-white/60 dark:bg-black/20 rounded-xl px-4 py-3 border border-white/80 dark:border-white/5">
                      {ex.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-center shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2">Put these tips into action</h3>
        <p className="text-indigo-100 text-sm mb-5">Create a Series and paste a prompt to generate your first video.</p>
        <Link
          href="/dashboard/create-series"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-md"
        >
          <Sparkles className="h-4 w-4" />
          Create a Series Now
        </Link>
      </div>
    </div>
  );
}
