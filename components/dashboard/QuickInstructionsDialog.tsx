"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, PlayCircle, Settings, Share2, Sparkles, Tv } from "lucide-react"

export function QuickInstructionsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            Quick Start Guide
          </DialogTitle>
          <DialogDescription className="text-base">
            Welcome to V Gen! Follow these simple steps to automate your faceless short video channels.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                    <Settings className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">1. Connect Your Accounts</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Head over to Settings to link your YouTube, TikTok, and Instagram accounts. This allows V Gen to auto-publish your videos.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                    <Tv className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">2. Create a Series</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Click &quot;Create New Series&quot; in the sidebar. Define your niche, visual style, voiceover, and posting schedule.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                    <PlayCircle className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">3. Generate Videos</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Click the &quot;Generate Video&quot; button on your Series card. We will write the script, generate AI images, add voiceovers, and stitch it all together!
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                    <Share2 className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">4. Auto-Publish</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Once rendering is complete, your video will automatically be posted to your connected platforms!
                    </p>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
