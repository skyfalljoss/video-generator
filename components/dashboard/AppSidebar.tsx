
"use client"

import * as React from "react"
import {
  CreditCard,
  Film,
  HelpCircle,
  Home,
  LayoutGrid,
  Settings,
  Tv,
  Users,
  Video,
  Plus,
  LogOut,
  User
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const pathname = usePathname()

  const navItems = [
    { title: "Series", icon: Tv, url: "/dashboard/series" },
    { title: "Video", icon: Video, url: "/dashboard/videos" },
    { title: "Guides", icon: HelpCircle, url: "/dashboard/guides" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
    { title: "Billing", icon: CreditCard, url: "/dashboard/billing" },
  ]

  return (
    <Sidebar {...props} className="border-r border-zinc-200 bg-zinc-50 dark:bg-zinc-900 border-none">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Video className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">V Gen</span>
        </div>
        <div className="mt-4">
          <Link href="/dashboard/create-series">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Create New Series
            </Button>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.url}
                className="h-10 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-zinc-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50"
              >
                <Link href={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-9 w-9 border border-zinc-200">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                  {user?.fullName || "User"}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <span>Credits Used</span>
                    <span>75%</span>
                </div>
                <Progress value={75} className="h-1.5 bg-zinc-100 dark:bg-zinc-700" />
            </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
