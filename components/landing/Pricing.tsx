import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out V Gen and creating your first AI videos.",
    highlight: false,
    cta: "Get Started Free",
    features: [
      { label: "1 Series", included: true },
      { label: "5 Video generations / month", included: true },
      { label: "AI Script & Voice generation", included: true },
      { label: "AI Image generation", included: true },
      { label: "Caption styles", included: true },
      { label: "YouTube auto-publish", included: false },
      { label: "Email notifications", included: false },
      { label: "Priority processing", included: false },
      { label: "Unlimited series", included: false },
    ],
  },
  {
    name: "Basic",
    price: "$9",
    period: "/ month",
    description: "For creators who want to grow their channel with consistent AI content.",
    highlight: true,
    badge: "Most Popular",
    cta: "Start Basic",
    features: [
      { label: "3 Series", included: true },
      { label: "30 Video generations / month", included: true },
      { label: "AI Script & Voice generation", included: true },
      { label: "AI Image generation", included: true },
      { label: "Caption styles", included: true },
      { label: "YouTube auto-publish", included: true },
      { label: "Email notifications", included: true },
      { label: "Priority processing", included: false },
      { label: "Unlimited series", included: false },
    ],
  },
  {
    name: "Unlimited",
    price: "$29",
    period: "/ month",
    description: "For power users and agencies building multiple content channels.",
    highlight: false,
    cta: "Go Unlimited",
    features: [
      { label: "Unlimited series", included: true },
      { label: "Unlimited video generations", included: true },
      { label: "AI Script & Voice generation", included: true },
      { label: "AI Image generation", included: true },
      { label: "Caption styles", included: true },
      { label: "YouTube auto-publish", included: true },
      { label: "Email notifications", included: true },
      { label: "Priority processing", included: true },
      { label: "Unlimited series", included: true },
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-4 text-lg text-zinc-600">
            Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-8 ring-1 transition-shadow hover:shadow-lg ${
                plan.highlight
                  ? "bg-indigo-600 ring-indigo-600 shadow-xl shadow-indigo-200"
                  : "bg-white ring-zinc-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900 shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold ${plan.highlight ? "text-indigo-100" : "text-zinc-500"}`}>
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-5xl font-extrabold tracking-tight ${plan.highlight ? "text-white" : "text-zinc-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-medium ${plan.highlight ? "text-indigo-200" : "text-zinc-400"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-3 text-sm leading-6 ${plan.highlight ? "text-indigo-100" : "text-zinc-600"}`}>
                  {plan.description}
                </p>
              </div>

              {/* CTA */}
              <SignedOut>
                <Link href="/sign-up" className="block">
                  <Button
                    className={`w-full rounded-full font-semibold ${
                      plan.highlight
                        ? "bg-white text-indigo-600 hover:bg-indigo-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="block">
                  <Button
                    className={`w-full rounded-full font-semibold ${
                      plan.highlight
                        ? "bg-white text-indigo-600 hover:bg-indigo-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {plan.name === "Free" ? "Go to Dashboard" : plan.cta}
                  </Button>
                </Link>
              </SignedIn>

              {/* Divider */}
              <div className={`my-6 border-t ${plan.highlight ? "border-indigo-500" : "border-zinc-100"}`} />

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    {f.included ? (
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.highlight ? "bg-indigo-500" : "bg-indigo-50"}`}>
                        <Check className={`h-3 w-3 ${plan.highlight ? "text-white" : "text-indigo-600"}`} />
                      </div>
                    ) : (
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.highlight ? "bg-indigo-700" : "bg-zinc-100"}`}>
                        <X className={`h-3 w-3 ${plan.highlight ? "text-indigo-400" : "text-zinc-400"}`} />
                      </div>
                    )}
                    <span className={`text-sm ${
                      f.included
                        ? plan.highlight ? "text-white" : "text-zinc-700"
                        : plan.highlight ? "text-indigo-300 line-through" : "text-zinc-400 line-through"
                    }`}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-400">
          All plans include a 7-day free trial. No credit card required on the Free plan.
        </p>
      </div>
    </section>
  );
}
