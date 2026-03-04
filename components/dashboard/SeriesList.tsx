
"use client"

import { Series, SeriesCard } from "./SeriesCard"
import { useState } from "react"
import { toast } from "sonner" // Assuming sonner is installed as per package.json
import { useRouter } from "next/navigation"

interface SeriesListProps {
    initialSeries: Series[]
}

export function SeriesList({ initialSeries }: SeriesListProps) {
    const [seriesList, setSeriesList] = useState<Series[]>(initialSeries)
    const router = useRouter()

    const handleEdit = (id: string) => {
        router.push(`/dashboard/series/${id}/edit`)
    }

    const handleDelete = async (id: string) => {
        const originalList = [...seriesList]
        // optimistically remove
        setSeriesList(prev => prev.filter(s => s.id !== id))

        try {
             const res = await fetch(`/api/series/${id}`, {
                method: "DELETE"
            })

            if (!res.ok) {
                throw new Error("Failed to delete")
            }
            
            toast.success("Series deleted")
            router.refresh() // Sync server state
        } catch (error) {
            console.error("Delete failed", error)
            toast.error("Failed to delete series")
            // Revert on error
            setSeriesList(originalList)
        }
    }

    const handlePauseResume = async (id: string) => {
        const seriesIndex = seriesList.findIndex(s => s.id === id)
        if (seriesIndex === -1) return

        const currentStatus = seriesList[seriesIndex].status
        // Only allow toggling if pending or paused
        if (currentStatus !== 'pending' && currentStatus !== 'paused') {
            toast.error("Can only pause pending series")
            return
        }

        const newStatus = currentStatus === 'pending' ? 'paused' : 'pending'
        const originalList = [...seriesList]

        // Optimistic update
        setSeriesList(prev => {
            const newList = [...prev]
            newList[seriesIndex] = { ...newList[seriesIndex], status: newStatus }
            return newList
        })

        try {
             const res = await fetch(`/api/series/${id}`, {
                method: "PATCH",
                 headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!res.ok) {
                throw new Error("Failed to update status")
            }
            
            toast.success(newStatus === 'paused' ? "Series paused" : "Series resumed")
            router.refresh()
        } catch (error) {
            console.error("Pause/Resume failed", error)
            toast.error("Failed to update status")
            setSeriesList(originalList)
        }
    }

    const handleGenerate = async (id: string) => {
        try {
            toast.info("Starting generation...")
            const res = await fetch(`/api/series/${id}/generate`, {
                method: "POST"
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to start generation")
            }
            
            toast.success("Generation started!")
            router.push("/dashboard/videos")
        } catch (error: any) {
            console.error("Generate failed", error)
            toast.error(error.message || "Failed to start generation")
        }
    }

    const handleViewVideo = (id: string) => {
        toast.info(`View video ${id} (Coming soon)`)
    }

    if (seriesList.length === 0) {
        return (
             <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-zinc-500">No projects found. Start creating!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {seriesList.map((series) => (
                <SeriesCard
                    key={series.id}
                    series={series}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPauseResume={handlePauseResume}
                    onGenerate={handleGenerate}
                    onViewVideo={handleViewVideo}
                />
            ))}
        </div>
    )
}
