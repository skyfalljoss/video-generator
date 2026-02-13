import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <VideoIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            ShortsGen AI
          </span>
        </Link>
        
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link href="#features" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Pricing
          </Link>
          <Link href="#resources" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Resources
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:block">
              Login
            </Link>
            <Link href="/sign-up">
              <Button className="bg-white text-black hover:bg-zinc-200">
                Get Started
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/10">
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
