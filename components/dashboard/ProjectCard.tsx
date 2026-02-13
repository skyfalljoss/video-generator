
import { MoreHorizontal, Play, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ProjectCardProps {
  title: string
  thumbnailUrl?: string
  status: "completed" | "processing" | "draft" | "failed"
  date: string
  duration?: string
}

export function ProjectCard({ title, thumbnailUrl, status, date, duration }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
      case "processing":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
      case "failed":
        return "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="mr-1 h-3 w-3" />
      case "processing":
        return <Clock className="mr-1 h-3 w-3" />
      case "failed":
        return <AlertCircle className="mr-1 h-3 w-3" />
      default: // draft
        return null
    }
  }

  return (
    <Card className="group overflow-hidden rounded-xl border-zinc-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:border-zinc-800 dark:hover:border-indigo-900">
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
         {thumbnailUrl ? (
            <Image src={thumbnailUrl || "/placeholder.svg"} alt={title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
         ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-300">
                <Play className="h-10 w-10 opacity-50" />
            </div>
         )}
         <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
         {duration && (
             <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
                 {duration}
             </span>
         )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-zinc-900 line-clamp-2 dark:text-white group-hover:text-indigo-600 transition-colors">
                {title}
            </h3>
            <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-8 w-8 text-zinc-400 hover:text-zinc-900">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
            </Button>
        </div>
        <div className="mt-2 flex items-center gap-2">
             <Badge variant="secondary" className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(status)} shadow-none border-transparent`}>
                {getStatusIcon(status)}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-zinc-500">
        Created {date}
      </CardFooter>
    </Card>
  )
}
