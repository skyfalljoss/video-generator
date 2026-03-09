"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Tv, Video, Loader2, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface SeriesResult {
    id: string
    name: string
    video_style: string
    status: string
    created_at: string
}

interface VideoResult {
    id: string
    series_id: string
    title: string | null
    status: string
    created_at: string
    final_video_url: string | null
    series_projects?: { id: string; name: string | null }
}

interface SearchResults {
    series: SeriesResult[]
    videos: VideoResult[]
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounced
}

type SearchState = {
    results: SearchResults | null
    open: boolean
    loading: boolean
}

export function SearchBar() {
    const [query, setQuery] = useState("")
    const [searchState, setSearchState] = useState<SearchState>({
        results: null,
        open: false,
        loading: false,
    })
    const loadingRef = useRef(false)
    const debouncedQuery = useDebounce(query, 300)
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const { results, open, loading } = searchState

    // Fetch results when debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) return

        let cancelled = false
        loadingRef.current = true
        // Use a micro-task so loading spinner shows without sync setState in effect
        Promise.resolve().then(() => {
            if (!cancelled) setSearchState(prev => ({ ...prev, loading: true }))
        })

        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
            .then(res => res.json())
            .then((data: SearchResults) => {
                if (!cancelled) {
                    loadingRef.current = false
                    setSearchState({ results: data, open: true, loading: false })
                }
            })
            .catch(err => {
                console.error(err)
                if (!cancelled) {
                    loadingRef.current = false
                    setSearchState(prev => ({ ...prev, loading: false }))
                }
            })

        return () => { cancelled = true }
    }, [debouncedQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setSearchState(prev => ({ ...prev, open: false }))
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Reset state when query is cleared (done in onChange, not in effect)
    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        if (!val.trim()) {
            setSearchState({ results: null, open: false, loading: false })
        }
    }, [])

    const handleSelectSeries = useCallback((id: string) => {
        router.push(`/dashboard/series/${id}/edit`)
        setSearchState(prev => ({ ...prev, open: false }))
        setQuery("")
    }, [router])

    const handleSelectVideo = useCallback((title: string) => {
        const encoded = encodeURIComponent(title)
        router.push(`/dashboard/videos?q=${encoded}`)
        setSearchState(prev => ({ ...prev, open: false }))
        setQuery("")
    }, [router])

    const totalResults = (results?.series?.length ?? 0) + (results?.videos?.length ?? 0)
    const showEmpty = open && !loading && results !== null && totalResults === 0

    return (
        <div ref={containerRef} className="relative w-full max-w-sm">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                {loading && (
                    <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-zinc-400 animate-spin" />
                )}
                <Input
                    type="search"
                    value={query}
                    onChange={handleQueryChange}
                    onFocus={() =>
                        results && totalResults > 0 &&
                        setSearchState(prev => ({ ...prev, open: true }))
                    }
                    onKeyDown={e => {
                        if (e.key === "Enter" && query.trim()) {
                            router.push(`/dashboard/videos?q=${encodeURIComponent(query.trim())}`)
                            setSearchState({ results: null, open: false, loading: false })
                            setQuery("")
                        }
                        if (e.key === "Escape") {
                            setSearchState(prev => ({ ...prev, open: false }))
                        }
                    }}
                    placeholder="Search…"
                    className="h-9 w-full rounded-full bg-zinc-50 pl-9 pr-9 border-zinc-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent dark:bg-zinc-900 dark:border-zinc-800"
                />
            </div>

            {/* Dropdown Results */}
            {(open || showEmpty) && (
                <div className="absolute top-full mt-2 w-full min-w-[320px] rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50 overflow-hidden">
                    {showEmpty ? (
                        <div className="px-4 py-6 text-center text-sm text-zinc-400">
                            No results for &ldquo;
                            <span className="font-medium text-zinc-600 dark:text-zinc-300">{query}</span>
                            &rdquo;
                        </div>
                    ) : (
                        <div className="py-1.5 max-h-[420px] overflow-y-auto">

                            {/* ── Series Section ── */}
                            {results && results.series.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                                        <Tv className="h-3.5 w-3.5 text-indigo-500" />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                            Series
                                        </span>
                                    </div>
                                    {results.series.map(series => (
                                        <button
                                            key={series.id}
                                            onClick={() => handleSelectSeries(series.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors text-left group"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                                                <Tv className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                                    {series.name}
                                                </p>
                                                <p className="text-[11px] text-zinc-400 capitalize">
                                                    {series.video_style || "No style"} · {series.status}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="shrink-0 text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-0 px-2"
                                            >
                                                Series
                                            </Badge>
                                            <ArrowRight className="h-3.5 w-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Divider */}
                            {results && results.series.length > 0 && results.videos.length > 0 && (
                                <div className="mx-3 my-1 border-t border-zinc-100 dark:border-zinc-800" />
                            )}

                            {/* ── Videos Section ── */}
                            {results && results.videos.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                                        <Video className="h-3.5 w-3.5 text-violet-500" />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                            Videos
                                        </span>
                                    </div>
                                    {results.videos.map(video => (
                                        <button
                                            key={video.id}
                                            onClick={() => handleSelectVideo(video.title || "Untitled Video")}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-left group"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                                                <Video className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                                    {video.title || "Untitled Video"}
                                                </p>
                                                <p className="text-[11px] text-zinc-400 truncate">
                                                    {video.series_projects?.name
                                                        ? `From: ${video.series_projects.name}`
                                                        : "Unknown series"}
                                                    {" · "}
                                                    <span className="capitalize">{video.status}</span>
                                                </p>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="shrink-0 text-[10px] bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-0 px-2"
                                            >
                                                Video
                                            </Badge>
                                            <ArrowRight className="h-3.5 w-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
