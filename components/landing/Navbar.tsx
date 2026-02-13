import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <VideoIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            ShortsGen AI
          </span>
        </Link>
        
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link href="#features" className="text-sm font-medium text-zinc-600 transition-colors hover:text-indigo-600">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-zinc-600 transition-colors hover:text-indigo-600">
            Pricing
          </Link>
          <Link href="#resources" className="text-sm font-medium text-zinc-600 transition-colors hover:text-indigo-600">
            Resources
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-indigo-600 sm:block">
              Login
            </Link>
            <Link href="/sign-up">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                Get Started
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-zinc-600 hover:text-indigo-600 hover:bg-zinc-100">
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
