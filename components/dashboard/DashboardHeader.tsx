
"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { QuickInstructionsDialog } from "./QuickInstructionsDialog"
import { NotificationsDropdown } from "./NotificationsDropdown"
import { UserButton } from "@clerk/nextjs"
import { SearchBar } from "./SearchBar"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white px-6 shadow-sm dark:border-zinc-800 dark:bg-black">
      <SidebarTrigger className="md:hidden" />
      
      <div className="flex flex-1 items-center gap-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2">
        <QuickInstructionsDialog />
        <NotificationsDropdown />
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 ring-2 ring-zinc-200 hover:ring-indigo-400 transition-all rounded-full"
            }
          }}
        />
      </div>
    </header>
  )
}
