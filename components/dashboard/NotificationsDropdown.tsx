"use client"

import { useEffect, useState, useCallback } from "react"
import { Bell, CheckCircle2, Clock, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow, format, isValid } from "date-fns"

export type NotificationItem = {
    id: string;
    title: string;
    status: 'pending' | 'completed' | 'failed';
    error_message?: string;
    created_at: string;
    updated_at: string;
}

/** Safe human-readable date — never shows "Invalid Date" */
function formatNotifDate(raw: string | undefined | null): string {
    if (!raw) return "Just now"
    const d = new Date(raw)
    if (!isValid(d)) return "Just now"

    const diffMs = Date.now() - d.getTime()
    const diffMins = diffMs / 60000

    // Within the last hour → relative ("5 minutes ago")
    if (diffMins < 60) return formatDistanceToNow(d, { addSuffix: true })

    // Same calendar day → "Today at 3:42 PM"
    const today = new Date()
    if (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    ) {
        return `Today at ${format(d, "h:mm a")}`
    }

    // Otherwise → "Mar 7 at 3:42 PM"
    return format(d, "MMM d") + ` at ${format(d, "h:mm a")}`
}

const SEEN_KEY = "notif_seen_at"

export function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    // Timestamp of last time the user opened the dropdown
    const [lastSeenAt, setLastSeenAt] = useState<number>(() => {
        if (typeof window === "undefined") return Date.now()
        return Number(localStorage.getItem(SEEN_KEY) ?? 0)
    })

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch('/api/notifications', { cache: 'no-store' })
            const data = await res.json()
            if (!res.ok) {
                console.error("Notifications API error:", res.status, data)
                return
            }
            if (data.notifications) {
                setNotifications(data.notifications)
            } else {
                console.warn("Notifications response missing 'notifications' key:", data)
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Initial fetch
    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    // Poll every 30s so the badge appears automatically after a video finishes
    useEffect(() => {
        const interval = setInterval(fetchNotifications, 30_000)
        return () => clearInterval(interval)
    }, [fetchNotifications])

    // Mark as seen when the dropdown is opened
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (isOpen) {
            fetchNotifications()
            const now = Date.now()
            setLastSeenAt(now)
            localStorage.setItem(SEEN_KEY, String(now))
        }
    }

    // Show red dot if any notification was updated AFTER the last time user opened dropdown
    const hasUnread = notifications.some(n => {
        const updatedAt = new Date(n.updated_at)
        return isValid(updatedAt) && updatedAt.getTime() > lastSeenAt
    })

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 relative"
            >
              <Bell className="h-5 w-5" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-950 animate-pulse" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 shadow-xl rounded-xl border-zinc-200 dark:border-zinc-800">
            <DropdownMenuLabel className="flex items-center justify-between py-3 px-4">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Notifications</span>
                {notifications.length > 0 && (
                    <span className="text-[11px] font-medium text-zinc-400">{notifications.length} recent</span>
                )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {loading && notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500">Loading...</div>
            ) : notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                        <Bell className="h-5 w-5 text-zinc-400" />
                    </div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-2">All caught up</p>
                    <p className="text-xs text-zinc-500">No recent notifications.</p>
                </div>
            ) : (
                <div className="max-h-[400px] overflow-y-auto py-1">
                    {notifications.map((notif) => {
                        const updatedAt = new Date(notif.updated_at)
                        const isNew = isValid(updatedAt) && updatedAt.getTime() > lastSeenAt

                        return (
                            <DropdownMenuItem
                                key={notif.id}
                                className="flex flex-col items-start gap-1.5 p-4 cursor-default border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:bg-zinc-50 dark:focus:bg-zinc-900"
                            >
                                <div className="flex items-start gap-3 w-full">
                                    {/* Status icon */}
                                    <div className="mt-0.5 shrink-0 relative">
                                        {notif.status === 'completed' && (
                                            <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <CheckCircle2 className="h-4.5 w-4.5 text-green-600 dark:text-green-500" />
                                            </div>
                                        )}
                                        {notif.status === 'failed' && (
                                            <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                <XCircle className="h-4.5 w-4.5 text-red-600 dark:text-red-500" />
                                            </div>
                                        )}
                                        {notif.status === 'pending' && (
                                            <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                <Clock className="h-4.5 w-4.5 text-amber-600 dark:text-amber-500 animate-pulse" />
                                            </div>
                                        )}
                                        {/* Unread indicator dot */}
                                        {isNew && (
                                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900" />
                                        )}
                                    </div>

                                    {/* Text content */}
                                    <div className="flex flex-col gap-0.5 w-full min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                                                {notif.title || "Untitled Video"}
                                            </span>
                                            {isNew && (
                                                <span className="shrink-0 text-[10px] font-bold text-red-500 uppercase tracking-wide">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 break-words whitespace-normal line-clamp-2">
                                            {notif.status === 'completed' && "Video successfully generated and ready to view."}
                                            {notif.status === 'pending' && "Video generation is in progress…"}
                                            {notif.status === 'failed' && (
                                                <span className="text-red-600 dark:text-red-400">
                                                    Failed: {notif.error_message || "Unknown error"}
                                                </span>
                                            )}
                                        </p>
                                        <span className="text-[11px] text-zinc-400 font-medium mt-1">
                                            {formatNotifDate(notif.updated_at || notif.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        )
                    })}
                </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
    )
}
