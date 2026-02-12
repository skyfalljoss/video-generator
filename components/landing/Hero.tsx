import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black pt-20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-sm font-medium text-zinc-300">
            v2.0 is now live
          </span>
        </div>
        
        <h1 className="mx-auto max-w-4xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
          Automate Your Content Empire with AI
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Generate, edit, and schedule viral shorts for YouTube, TikTok, and Instagram in minutes. 
          Stop editing manually. Let AI do the heavy lifting.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" className="h-12 rounded-full bg-white px-8 text-base font-semibold text-black hover:bg-zinc-200">
            Start for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 rounded-full border-white/10 bg-white/5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10">
            <PlayCircle className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        {/* Mock UI / Visual */}
        <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm lg:rounded-2xl lg:p-4">
           <div className="aspect-video overflow-hidden rounded-lg bg-zinc-900 shadow-2xl">
             <div className="flex h-full items-center justify-center text-zinc-700">
                <span className="text-lg font-medium">App Dashboard Preview</span>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
