"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, ArrowRight, ShieldCheck } from "lucide-react";

interface PlanUpgradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function PlanUpgradeDialog({ 
    isOpen, 
    onOpenChange, 
    title = "Upgrade Required", 
    description = "You have reached the limit for your current plan. Please upgrade to continue generating videos." 
}: PlanUpgradeDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="relative h-32 w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-8 w-32 h-32 bg-white/10 rounded-full blur-[20px]"></div>
            <div className="absolute bottom-0 left-0 translate-y-8 -translate-x-12 w-24 h-24 bg-white/10 rounded-full blur-[16px]"></div>
            
            <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                <Zap className="h-8 w-8 text-white fill-white" />
            </div>
        </div>

        <div className="px-6 pt-6 pb-6 text-center space-y-4">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 text-center">
                    {title}
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-2 leading-relaxed mx-auto max-w-[90%]">
                    {description}
                </DialogDescription>
            </DialogHeader>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 flex items-start gap-3 text-left border border-zinc-100 dark:border-zinc-800">
                <ShieldCheck className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                    <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Unlock more power</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Basic and Unlimited plans give you far more video generations and premium features.</p>
                </div>
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-2 pt-2 sm:space-x-0">
                <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 h-11"
                    onClick={() => {
                        onOpenChange(false);
                        router.push("/dashboard/billing");
                    }}
                >
                    <Sparkles className="h-4 w-4 mr-2" />
                    View Upgrade Plans
                    <ArrowRight className="h-4 w-4 ml-2 opacity-70" />
                </Button>
                <Button 
                    variant="ghost" 
                    className="w-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    onClick={() => onOpenChange(false)}
                >
                    Maybe Later
                </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
