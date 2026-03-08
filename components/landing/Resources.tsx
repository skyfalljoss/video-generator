import Link from "next/link";
import { BookOpen, Youtube, MessageCircle, HelpCircle, FileText, Lightbulb } from "lucide-react";

const resources = [
  {
    icon: <Youtube className="h-6 w-6 text-red-500" />,
    bg: "bg-red-50",
    title: "YouTube Tutorial",
    description: "Follow along as we build a full AI video series from scratch — step by step.",
    href: `https://www.youtube.com/watch?v=eRkh8-X097U`,
    label: "Watch on YouTube",
    external: true,
  },
  {
    icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
    bg: "bg-indigo-50",
    title: "Getting Started Guide",
    description: "New to V Gen? Learn how to create your first series and generate your first video in minutes.",
    href: "/guides",
    label: "Read the guide",
    external: false,
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
    bg: "bg-amber-50",
    title: "Best Niches for AI Shorts",
    description: "Discover the top-performing content niches that go viral on YouTube Shorts and TikTok.",
    href: "#",
    label: "Explore niches",
    external: false,
  },
  {
    icon: <FileText className="h-6 w-6 text-green-600" />,
    bg: "bg-green-50",
    title: "Script Writing Tips",
    description: "Learn how to craft AI prompts that produce punchy, scroll-stopping video scripts.",
    href: "/script-tips",
    label: "Read tips",
    external: false,
  },
  {
    icon: <HelpCircle className="h-6 w-6 text-purple-600" />,
    bg: "bg-purple-50",
    title: "FAQ",
    description: "Common questions about generation limits, voice options, platform publishing, and billing.",
    href: "#faq",
    label: "Browse FAQ",
    external: false,
  },
  {
    icon: <MessageCircle className="h-6 w-6 text-sky-600" />,
    bg: "bg-sky-50",
    title: "Community & Support",
    description: "Join other creators using V Gen. Share tips, get help, and see what people are building.",
    href: "#",
    label: "Join community",
    external: false,
  },
];

const faqs = [
  {
    q: "How many videos can I generate per month?",
    a: "Free users get 5 videos/month. Basic plan gets 30. Unlimited plan has no cap.",
  },
  {
    q: "What platforms can I auto-publish to?",
    a: "Currently YouTube is supported for auto-publishing. TikTok and Instagram are on the roadmap.",
  },
  {
    q: "Can I use my own voice or music?",
    a: "You can choose from 20+ AI voices and multiple background music tracks. Custom uploads are coming soon.",
  },
  {
    q: "How long does video generation take?",
    a: "Most videos complete in 3–8 minutes depending on length and server load.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — the Free plan is free forever with no credit card required. Paid plans include a 7-day trial.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel any time from your billing settings with no fees or lock-ins.",
  },
];

export function Resources() {
  return (
    <section id="resources" className="bg-zinc-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ── Resources grid ── */}
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Resources</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Everything you need to get results
          </p>
          <p className="mt-4 text-lg text-zinc-600">
            Guides, tutorials, and community support to help you hit your first 1,000 subscribers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              target={r.external ? "_blank" : undefined}
              rel={r.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-4 rounded-2xl bg-white p-7 ring-1 ring-zinc-200 transition-all hover:shadow-lg hover:ring-indigo-200"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.bg}`}>
                {r.icon}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                  {r.title}
                </h3>
                <p className="mt-1.5 text-sm text-zinc-500 leading-6">{r.description}</p>
              </div>
              <span className="mt-auto text-sm font-medium text-indigo-600 group-hover:underline">
                {r.label} →
              </span>
            </Link>
          ))}
        </div>

        {/* ── FAQ ── */}
        <div id="faq" className="mt-24">
          <div className="mx-auto max-w-2xl lg:text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mx-auto max-w-3xl divide-y divide-zinc-200 rounded-2xl bg-white ring-1 ring-zinc-200 overflow-hidden">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group px-6 py-5 cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 font-semibold text-zinc-900 list-none select-none">
                  {faq.q}
                  <span className="text-indigo-600 text-xl font-light group-open:rotate-45 transition-transform duration-200 shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-600 leading-6">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
