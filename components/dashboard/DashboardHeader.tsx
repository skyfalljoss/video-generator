
"use client"

import { Bell, HelpCircle, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white px-6 shadow-sm dark:border-zinc-800 dark:bg-black">
      <SidebarTrigger className="md:hidden" />
      
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="h-9 w-full rounded-full bg-zinc-50 pl-9 border-zinc-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-800"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
