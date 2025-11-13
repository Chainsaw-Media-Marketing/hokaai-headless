"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const XIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface PredictiveResult {
  id: string
  title: string
  handle: string
  image: string
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [predictiveResults, setPredictiveResults] = useState<PredictiveResult[]>([])
  const [isLoadingPredictive, setIsLoadingPredictive] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const debounceTimerRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setPredictiveResults([])
      setSelectedIndex(-1)
      return
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoadingPredictive(true)
      try {
        const response = await fetch(`/api/search-predictive?q=${encodeURIComponent(searchQuery.trim())}`)
        if (response.ok) {
          const data = await response.json()
          setPredictiveResults(data.results || [])
        } else {
          setPredictiveResults([])
        }
      } catch (error) {
        console.error("Predictive search error:", error)
        setPredictiveResults([])
      } finally {
        setIsLoadingPredictive(false)
      }
    }, 250)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (predictiveResults.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < predictiveResults.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      const selected = predictiveResults[selectedIndex]
      router.push(`/products/${selected.handle}`)
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?type=product&q=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setPredictiveResults([])
      setSelectedIndex(-1)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="border-b border-slate-400 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="font-heading text-xl font-bold text-brand-primary">Search Products</div>
          <button
            onClick={onClose}
            className="p-2 text-slate-700 hover:text-brand-primary transition-colors"
            aria-label="Close search"
          >
            <XIcon />
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for beef, lamb, boerewors..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-success focus:border-transparent"
              autoFocus
              autoComplete="off"
            />

            {searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-xl shadow-lg max-h-96 overflow-y-auto z-10">
                {isLoadingPredictive ? (
                  <div className="p-4 text-center text-slate-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
                  </div>
                ) : predictiveResults.length > 0 ? (
                  <div className="py-2">
                    {predictiveResults.map((result, index) => (
                      <Link
                        key={result.id}
                        href={`/products/${result.handle}`}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                          index === selectedIndex ? "bg-slate-100" : ""
                        }`}
                      >
                        <img
                          src={result.image || "/placeholder.svg?height=48&width=48"}
                          alt={result.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="text-slate-700 font-medium">{result.title}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500">No matches found</div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <Button type="submit" size="lg" disabled={!searchQuery.trim()}>
              Search Products
            </Button>
          </div>
        </form>

        {/* Popular Searches */}
        <div className="max-w-2xl mx-auto mt-12">
          <h3 className="text-label text-slate-500 mb-4">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {["Ribeye Steak", "Boerewors", "Lamb Chops", "Biltong", "Sosaties", "Braai Pack"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-4 py-2 bg-slate-50 text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
