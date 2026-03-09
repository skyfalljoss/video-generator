import Link from "next/link";
import { VideoIcon, Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <VideoIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-900">V Gen</span>
            </Link>
            <p className="text-sm leading-6 text-zinc-600">
              The AI-powered video generator for content creators.
              Scale your social media presence with automation.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-zinc-400 hover:text-indigo-600">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-indigo-600">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-indigo-600">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-zinc-900">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="#features" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#demo" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600">
                      Demo
                    </Link>
                  </li>
                  <li>
                    <Link href="#hero" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-zinc-900">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="#resources" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600">
                      Getting Started
                    </Link>
                  </li>
                  <li>
                    <Link href="#faq" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href={`https://www.youtube.com/watch?v=eRkh8-X097U`} target="_blank" rel="noopener noreferrer" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600">
                      Video Tutorial
                    </Link>
                  </li>
                  <li>
                    <Link href="#resources" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600">
                      Community
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-zinc-200 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-zinc-500">
            &copy; {new Date().getFullYear()} V Gen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
