"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  className?: string
}

export function Pagination({ currentPage, totalPages, baseUrl, className = "" }: PaginationProps) {
  const router = useRouter()

  if (totalPages <= 1) return null

  const buildPageUrl = (page: number) => {
    const [pathname, queryString] = baseUrl.split("?")
    const params = new URLSearchParams(queryString || "")

    params.set("page", page.toString())

    const search = params.toString()
    const finalUrl = `${pathname}?${search}`

    return finalUrl
  }

  const handlePageClick = (page: number) => {
    if (page === currentPage) {
      return
    }

    const url = buildPageUrl(page)
    router.push(url)
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push("ellipsis")
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis")
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav role="navigation" aria-label="Pagination" className={`flex items-center justify-center gap-1 ${className}`}>
      {currentPage > 1 ? (
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed rounded-lg">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </span>
      )}

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, idx) => {
          if (pageNum === "ellipsis") {
            return (
              <span key={`ellipsis-${idx}`} className="px-3 py-2 text-slate-500">
                ...
              </span>
            )
          }

          const isActive = pageNum === currentPage

          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      {currentPage < totalPages ? (
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed rounded-lg">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  )
}
