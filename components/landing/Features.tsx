import { 
  Wand2, 
  CalendarClock, 
  Layers, 
  Mail, 
  Zap, 
  Share2 
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Wand2 className="h-6 w-6 text-purple-400" />,
      title: "AI Video Generation",
      description: "Transform text prompts into high-quality vertical videos instantly.",
    },
    {
      icon: <CalendarClock className="h-6 w-6 text-indigo-400" />,
      title: "Auto-Scheduler",
      description: "Set your content on autopilot. Schedule weeks of content in one click.",
    },
    {
      icon: <Layers className="h-6 w-6 text-pink-400" />,
      title: "Multi-Platform Ready",
      description: "Optimized formats for YouTube Shorts, Instagram Reels, and TikTok.",
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-400" />,
      title: "Email Integration",
      description: "Get notified via email when your videos are ready or posted.",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "Viral Hooks",
      description: "AI generates catchy hooks and captions to maximize engagement.",
    },
    {
      icon: <Share2 className="h-6 w-6 text-green-400" />,
      title: "Cross-Posting",
      description: "Publish to all your social accounts simultaneously.",
    },
  ];

  return (
    <section id="features" className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Deploy Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to scale your short-form content
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Stop wasting hours editing. Our AI handles the entire workflow from idea to upload.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col rounded-2xl bg-zinc-900/50 p-8 ring-1 ring-white/10 transition-all hover:bg-zinc-900 hover:ring-indigo-500/50">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
