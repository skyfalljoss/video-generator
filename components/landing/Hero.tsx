"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function Hero() {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-white pt-20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-4 text-center pt-16 pb-24 min-h-screen flex flex-col items-center justify-center">
        <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 mb-8 backdrop-blur-sm shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-sm font-medium text-zinc-600">v2.0 is now live</span>
        </div>
        
        <h1 className="mx-auto max-w-4xl bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
          Automate Your Content Empire with AI
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
          Generate, edit, and schedule viral shorts for YouTube, TikTok, and Instagram in minutes.{" "}
          Stop editing manually. Let AI do the heavy lifting.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="h-12 rounded-full bg-indigo-600 px-8 text-base font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="h-12 rounded-full bg-indigo-600 px-8 text-base font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </SignedIn>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToDemo}
            className="h-12 rounded-full border-zinc-200 bg-white text-base font-semibold text-zinc-900 hover:bg-zinc-50 hover:text-indigo-600 transition-colors"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        {/* Dashboard Preview Screenshot */}
        <div className="mt-20 relative mx-auto max-w-5xl w-full">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-indigo-200 via-purple-100 to-transparent blur-sm opacity-70" />
          <div className="relative rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl lg:rounded-2xl lg:p-3 overflow-hidden">
            <Image
              src="/dashboard-preview.png"
              alt="V Gen Dashboard"
              width={1280}
              height={800}
              className="w-full rounded-lg object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
