import { PlayCircle } from "lucide-react";

export function DemoVideo() {
  return (
    <section id="demo" className="bg-zinc-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 mb-4">
            <PlayCircle className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Product Demo</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            See V Gen in action
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Watch how easy it is to generate a full AI short video — from topic to finished video — in under 5 minutes.
          </p>
        </div>

        {/* Video player */}
        <div className="relative mx-auto max-w-4xl">
          {/* Glow effect */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-indigo-300/30 via-purple-200/20 to-transparent blur-xl" />

          <div className="relative rounded-2xl border border-zinc-200 bg-zinc-950 shadow-2xl overflow-hidden aspect-video">
            <iframe
              src="https://www.youtube.com/embed/eRkh8-X097U?rel=0&modestbranding=1"
              title="V Gen Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
