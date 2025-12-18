"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { CollectionFilterSidebar } from "@/components/collection-filter-sidebar"
import ProductGrid from "@/components/product-grid"
import Pagination from "@/components/pagination"
import type { Product, FilterOption } from "@/lib/types"
import { Check } from "lucide-react"
import { LayoutGrid, Grid3x3, X } from "lucide-react"

const PRODUCTS_PER_PAGE = 36

interface CollectionClientProps {
  initialProducts: Product[]
  totalCount: number
  collectionHandle: string
  availableFilters: FilterOption
  collectionTitle: string
}

export default function CollectionClient({
  initialProducts,
  totalCount,
  collectionHandle,
  availableFilters,
  collectionTitle,
}: CollectionClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name-az" | "name-za">("featured")
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false)
  const sortPopoverRef = useRef<HTMLDivElement>(null)

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({})
  const [gridDensity, setGridDensity] = useState<"comfortable" | "compact">("comfortable")

  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("page")
    const page = pageParam ? Number.parseInt(pageParam, 10) : 1
    return page > 0 ? page : 1
  }, [searchParams])

  useEffect(() => {
    const sortParam = searchParams.get("sort")
    if (sortParam === "price-low" || sortParam === "price-high" || sortParam === "name-az" || sortParam === "name-za") {
      setSortBy(sortParam)
    } else {
      setSortBy("featured")
    }
  }, [searchParams])

  useEffect(() => {
    const parseFilterValue = (value: string | null): string[] => {
      if (!value) return []
      return value.includes(",") ? value.split(",").map((v) => v.trim()) : [value]
    }

    const paramsWithoutPage = new URLSearchParams(searchParams.toString())
    paramsWithoutPage.delete("page")

    const filtersFromUrl: { [key: string]: string[] } = {}
    Object.keys(availableFilters).forEach((key) => {
      filtersFromUrl[key] = parseFilterValue(searchParams.get(key))
    })

    const sanitized = filtersFromUrl

    const currentFiltersJson = JSON.stringify(activeFilters)
    const newFiltersJson = JSON.stringify(sanitized)

    if (currentFiltersJson !== newFiltersJson) {
      setActiveFilters(sanitized)
    }
  }, [searchParams, availableFilters])

  useEffect(() => {
    if (typeof window === "undefined" || !window.sessionStorage) return

    const collectionUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
    const scrollKey = `scroll-${collectionUrl}`

    try {
      const savedScroll = sessionStorage.getItem(scrollKey)
      if (savedScroll) {
        const scrollY = Number.parseInt(savedScroll, 10)

        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY)
          sessionStorage.removeItem(scrollKey)
        })
      }
    } catch (error) {
      console.error("[v0] Failed to restore scroll position:", error)
    }
  }, [pathname, searchParams])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  const getActiveFilterLabels = useMemo(() => {
    const labels: string[] = []

    Object.keys(activeFilters).forEach((key) => {
      if (activeFilters[key].length > 0) {
        labels.push(...activeFilters[key])
      }
    })

    return labels
  }, [activeFilters])

  const hasActiveFilters = getActiveFilterLabels.length > 0

  const collectionUrl = useMemo(() => {
    const params = searchParams.toString()
    return params ? `${pathname}?${params}` : pathname
  }, [pathname, searchParams.toString()])

  const handleFiltersChange = useCallback(
    (filters: { [key: string]: string[] }) => {
      const normalized = filters

      const allFiltersEmpty = Object.values(normalized).every((arr) => arr.length === 0)

      if (allFiltersEmpty) {
        setActiveFilters(normalized)
        router.push(`${pathname}?page=1`)
        return
      }

      const params = new URLSearchParams()

      params.set("page", "1")

      Object.keys(normalized).forEach((key) => {
        if (normalized[key].length > 0) {
          params.set(key, normalized[key].join(","))
        }
      })

      const currentSort = searchParams.get("sort")
      if (currentSort && currentSort !== "featured") {
        params.set("sort", currentSort)
      }

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.push(newUrl)
    },
    [pathname, router, searchParams],
  )

  const handleSortChange = useCallback(
    (newSortBy: "featured" | "price-low" | "price-high" | "name-az" | "name-za") => {
      setSortBy(newSortBy)
      setIsMobileSortOpen(false)

      const params = new URLSearchParams(searchParams.toString())

      if (newSortBy === "featured") {
        params.delete("sort")
      } else {
        params.set("sort", newSortBy)
      }

      params.delete("page")

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.push(newUrl)
    },
    [pathname, searchParams, router],
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortPopoverRef.current && !sortPopoverRef.current.contains(event.target as Node)) {
        setIsMobileSortOpen(false)
      }
    }

    if (isMobileSortOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileSortOpen])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <CollectionFilterSidebar
            initialFilters={activeFilters}
            availableFilters={availableFilters}
            onFiltersChange={handleFiltersChange}
            collectionHandle={collectionHandle}
          />
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <div className="lg:hidden mb-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="flex-1 px-4 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                  Filters
                </button>
                <div className="flex-1 relative" ref={sortPopoverRef}>
                  <button
                    onClick={() => setIsMobileSortOpen(!isMobileSortOpen)}
                    className="w-full px-4 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
                  >
                    Sort
                  </button>

                  {isMobileSortOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                      <button
                        onClick={() => handleSortChange("featured")}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-between min-h-[44px]"
                      >
                        <span className={sortBy === "featured" ? "font-semibold text-brand-red" : "text-slate-700"}>
                          Featured
                        </span>
                        {sortBy === "featured" && <Check className="w-5 h-5 text-brand-red" />}
                      </button>
                      <button
                        onClick={() => handleSortChange("price-low")}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-between min-h-[44px] border-t border-slate-100"
                      >
                        <span className={sortBy === "price-low" ? "font-semibold text-brand-red" : "text-slate-700"}>
                          Price: Low to High
                        </span>
                        {sortBy === "price-low" && <Check className="w-5 h-5 text-brand-red" />}
                      </button>
                      <button
                        onClick={() => handleSortChange("price-high")}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-between min-h-[44px] border-t border-slate-100"
                      >
                        <span className={sortBy === "price-high" ? "font-semibold text-brand-red" : "text-slate-700"}>
                          Price: High to Low
                        </span>
                        {sortBy === "price-high" && <Check className="w-5 h-5 text-brand-red" />}
                      </button>
                      <button
                        onClick={() => handleSortChange("name-az")}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-between min-h-[44px] border-t border-slate-100"
                      >
                        <span className={sortBy === "name-az" ? "font-semibold text-brand-red" : "text-slate-700"}>
                          Name: A to Z
                        </span>
                        {sortBy === "name-az" && <Check className="w-5 h-5 text-brand-red" />}
                      </button>
                      <button
                        onClick={() => handleSortChange("name-za")}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-between min-h-[44px] border-t border-slate-100"
                      >
                        <span className={sortBy === "name-za" ? "font-semibold text-brand-red" : "text-slate-700"}>
                          Name: Z to A
                        </span>
                        {sortBy === "name-za" && <Check className="w-5 h-5 text-brand-red" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isMobileFilterOpen && (
                <div className="mb-3">
                  <CollectionFilterSidebar
                    initialFilters={activeFilters}
                    availableFilters={availableFilters}
                    onFiltersChange={(filters) => {
                      handleFiltersChange(filters)
                      setIsMobileFilterOpen(false)
                    }}
                    collectionHandle={collectionHandle}
                  />
                </div>
              )}

              <div className="mt-3">
                <p className="text-slate-600 text-sm text-center">
                  {totalCount === 0 ? (
                    "No products"
                  ) : (
                    <>
                      Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                      {Math.min(currentPage * PRODUCTS_PER_PAGE, totalCount)} of {totalCount}
                    </>
                  )}
                </p>
              </div>

              {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {getActiveFilterLabels.map((label, index) => (
                    <span
                      key={`${label}-${index}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                    >
                      {label}
                    </span>
                  ))}
                  <button
                    onClick={() =>
                      handleFiltersChange({
                        meatType: [],
                        cutFamily: [],
                        occasion: [],
                        department: [],
                        deliType: [],
                        spiceFamily: [],
                        braaiGearFamily: [],
                        groceryFamily: [],
                        bulkType: [],
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1 text-brand-red hover:bg-red-50 rounded-full text-sm font-medium transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center justify-between">
              <p className="text-slate-700">
                {totalCount === 0 ? (
                  "No products"
                ) : (
                  <>
                    Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                    {Math.min(currentPage * PRODUCTS_PER_PAGE, totalCount)} of {totalCount}
                  </>
                )}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border border-slate-300 rounded-lg p-1">
                  <button
                    onClick={() => setGridDensity("comfortable")}
                    className={`p-2 rounded transition-colors ${
                      gridDensity === "comfortable" ? "bg-brand-red text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                    title="3 columns"
                    aria-label="3 column grid"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridDensity("compact")}
                    className={`p-2 rounded transition-colors ${
                      gridDensity === "compact" ? "bg-brand-red text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                    title="4 columns"
                    aria-label="4 column grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    handleSortChange(e.target.value as "featured" | "price-low" | "price-high" | "name-az" | "name-za")
                  }
                  className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                  <option value="name-za">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {totalCount > PRODUCTS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / PRODUCTS_PER_PAGE)}
              baseUrl={collectionUrl}
              className="mb-6 lg:hidden"
              mobileSimple
            />
          )}

          {totalCount > PRODUCTS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / PRODUCTS_PER_PAGE)}
              baseUrl={collectionUrl}
              className="mb-6 hidden lg:flex"
            />
          )}

          <ProductGrid
            products={initialProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)}
            showQuickAdd
            gridDensity={gridDensity}
            collectionUrl={collectionUrl}
          />

          {totalCount > PRODUCTS_PER_PAGE && (
            <>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / PRODUCTS_PER_PAGE)}
                baseUrl={collectionUrl}
                className="mt-8 hidden lg:flex"
              />
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / PRODUCTS_PER_PAGE)}
                baseUrl={collectionUrl}
                className="mt-8 lg:hidden"
                mobileSimple
              />
            </>
          )}

          {totalCount === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg mb-4">No products match your filters.</p>
              <button
                onClick={() =>
                  handleFiltersChange({
                    meatType: [],
                    cutFamily: [],
                    occasion: [],
                    department: [],
                    deliType: [],
                    spiceFamily: [],
                    braaiGearFamily: [],
                    groceryFamily: [],
                    bulkType: [],
                  })
                }
                className="text-brand-red hover:underline font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { CollectionClient as CollectionPageClient }
