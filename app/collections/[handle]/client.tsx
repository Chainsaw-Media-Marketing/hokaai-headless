"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { CollectionFilterSidebar } from "@/components/collection-filter-sidebar"
import { Pagination } from "@/components/pagination"
import { productMatchesFilters, sanitizeFilters, type FilterState } from "@/lib/filter-utils"
import type { Product } from "@/lib/types"
import { LayoutGrid, Grid3x3, X, Check } from "lucide-react"
import Link from "next/link"

const PRODUCTS_PER_PAGE = 36

interface CollectionPageClientProps {
  title: string
  description: string
  products: Product[]
  initialFilters: FilterState
  collectionHandle: string
}

export function CollectionPageClient({
  title,
  description,
  products,
  initialFilters,
  collectionHandle,
}: CollectionPageClientProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const prevFiltersRef = useRef<string>("")
  const sortPopoverRef = useRef<HTMLDivElement>(null)

  const [activeFilters, setActiveFilters] = useState<FilterState>(sanitizeFilters(initialFilters))
  const [gridDensity, setGridDensity] = useState<"comfortable" | "compact">("comfortable")
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name-az" | "name-za">("featured")
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false)
  const [mobileGridCols, setMobileGridCols] = useState<1 | 2>(2)

  useEffect(() => {
    const stored = localStorage.getItem("hk_mobile_grid_cols")
    if (stored === "1" || stored === "2") {
      setMobileGridCols(Number.parseInt(stored) as 1 | 2)
    }
  }, [])

  const handleMobileGridChange = useCallback((cols: 1 | 2) => {
    setMobileGridCols(cols)
    localStorage.setItem("hk_mobile_grid_cols", cols.toString())
  }, [])

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

    const filtersFromUrl: FilterState = {
      meatType: parseFilterValue(searchParams.get("meat_type")),
      cutFamily: parseFilterValue(searchParams.get("cut_family")),
      occasion: parseFilterValue(searchParams.get("occasion")),
      department: parseFilterValue(searchParams.get("department")),
      deliType: parseFilterValue(searchParams.get("deli_type")),
      spiceFamily: parseFilterValue(searchParams.get("spice_family")),
      braaiGearFamily: parseFilterValue(searchParams.get("braai_gear_family")),
      groceryFamily: parseFilterValue(searchParams.get("grocery_family")),
      bulkType: parseFilterValue(searchParams.get("bulk_type")),
    }

    const sanitized = sanitizeFilters(filtersFromUrl)

    const currentFiltersJson = JSON.stringify(activeFilters)
    const newFiltersJson = JSON.stringify(sanitized)

    if (currentFiltersJson !== newFiltersJson) {
      setActiveFilters(sanitized)
    }
  }, [
    searchParams.get("meat_type"),
    searchParams.get("cut_family"),
    searchParams.get("occasion"),
    searchParams.get("department"),
    searchParams.get("deli_type"),
    searchParams.get("spice_family"),
    searchParams.get("braai_gear_family"),
    searchParams.get("grocery_family"),
    searchParams.get("bulk_type"),
  ])

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortPopoverRef.current && !sortPopoverRef.current.contains(event.target as Node)) {
        setIsMobileSortOpen(false)
      }
    }

    if (isMobileSortOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isMobileSortOpen])

  const availableFilters = useMemo(() => {
    const meatTypeCounts = new Map<string, number>()
    const cutFamilyCounts = new Map<string, number>()
    const occasionCounts = new Map<string, number>()
    const departmentCounts = new Map<string, number>()
    const deliTypeCounts = new Map<string, number>()
    const spiceFamilyCounts = new Map<string, number>()
    const braaiGearFamilyCounts = new Map<string, number>()
    const groceryFamilyCounts = new Map<string, number>()
    const bulkTypeCounts = new Map<string, number>()

    products.forEach((product) => {
      if (product.meat_type) {
        meatTypeCounts.set(product.meat_type, (meatTypeCounts.get(product.meat_type) || 0) + 1)
      }
      if (product.cut_family) {
        cutFamilyCounts.set(product.cut_family, (cutFamilyCounts.get(product.cut_family) || 0) + 1)
      }
      if (product.occasion) {
        product.occasion.forEach((oc) => occasionCounts.set(oc, (occasionCounts.get(oc) || 0) + 1))
      }
      if (product.department) {
        departmentCounts.set(product.department, (departmentCounts.get(product.department) || 0) + 1)
      }
      if (product.deli_type) {
        deliTypeCounts.set(product.deli_type, (deliTypeCounts.get(product.deli_type) || 0) + 1)
      }
      if (product.spice_family) {
        spiceFamilyCounts.set(product.spice_family, (spiceFamilyCounts.get(product.spice_family) || 0) + 1)
      }
      if (product.braai_gear_family) {
        braaiGearFamilyCounts.set(
          product.braai_gear_family,
          (braaiGearFamilyCounts.get(product.braai_gear_family) || 0) + 1,
        )
      }
      if (product.grocery_family) {
        groceryFamilyCounts.set(product.grocery_family, (groceryFamilyCounts.get(product.grocery_family) || 0) + 1)
      }
      if (product.bulk_type) {
        bulkTypeCounts.set(product.bulk_type, (bulkTypeCounts.get(product.bulk_type) || 0) + 1)
      }
    })

    return {
      meatTypes: Array.from(meatTypeCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      cutFamilies: Array.from(cutFamilyCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      occasions: Array.from(occasionCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      departments: Array.from(departmentCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      deliTypes: Array.from(deliTypeCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      spiceFamilies: Array.from(spiceFamilyCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      braaiGearFamilies: Array.from(braaiGearFamilyCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      groceryFamilies: Array.from(groceryFamilyCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      bulkTypes: Array.from(bulkTypeCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => productMatchesFilters(product, activeFilters))
  }, [products, activeFilters])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]

    switch (sortBy) {
      case "name-az":
        return sorted.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }))
      case "name-za":
        return sorted.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: "base" }))
      case "price-low":
        return sorted.sort((a, b) => {
          const priceA = a.minVariantPrice ?? (a.variants?.[0] ? Number.parseFloat(a.variants[0].price.amount) : 0)
          const priceB = b.minVariantPrice ?? (b.variants?.[0] ? Number.parseFloat(b.variants[0].price.amount) : 0)
          return priceA - priceB
        })
      case "price-high":
        return sorted.sort((a, b) => {
          const priceA = a.minVariantPrice ?? (a.variants?.[0] ? Number.parseFloat(a.variants[0].price.amount) : 0)
          const priceB = b.minVariantPrice ?? (b.variants?.[0] ? Number.parseFloat(b.variants[0].price.amount) : 0)
          return priceB - priceA
        })
      case "featured":
      default:
        return sorted
    }
  }, [filteredProducts, sortBy])

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

  const displayStart = sortedProducts.length === 0 ? 0 : startIndex + 1
  const displayEnd = Math.min(endIndex, sortedProducts.length)
  const displayTotal = sortedProducts.length

  const handleFiltersChange = useCallback(
    (filters: FilterState) => {
      const normalized = {
        ...filters,
        department: filters.department.slice(0, 1),
      }

      const allFiltersEmpty = Object.values(normalized).every((arr) => arr.length === 0)

      if (allFiltersEmpty) {
        setActiveFilters(normalized)
        router.push(`${pathname}?page=1`)
        return
      }

      const params = new URLSearchParams()

      params.set("page", "1")

      if (normalized.meatType.length > 0) {
        params.set("meat_type", normalized.meatType.join(","))
      }

      if (normalized.cutFamily.length > 0) {
        params.set("cut_family", normalized.cutFamily.join(","))
      }

      if (normalized.occasion.length > 0) {
        params.set("occasion", normalized.occasion.join(","))
      }

      if (normalized.department.length > 0) {
        params.set("department", normalized.department.join(","))
      }

      if (normalized.deliType.length > 0) {
        params.set("deli_type", normalized.deliType.join(","))
      }

      if (normalized.spiceFamily.length > 0) {
        params.set("spice_family", normalized.spiceFamily.join(","))
      }

      if (normalized.braaiGearFamily.length > 0) {
        params.set("braai_gear_family", normalized.braaiGearFamily.join(","))
      }

      if (normalized.groceryFamily.length > 0) {
        params.set("grocery_family", normalized.groceryFamily.join(","))
      }

      if (normalized.bulkType.length > 0) {
        params.set("bulk_type", normalized.bulkType.join(","))
      }

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
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === "featured") {
        params.delete("sort")
        setSortBy("featured")
      } else if (value === "price-low" || value === "price-high" || value === "name-az" || value === "name-za") {
        params.set("sort", value)
        setSortBy(value as "price-low" | "price-high" | "name-az" | "name-za")
      }

      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`
      router.push(newUrl)

      setIsMobileSortOpen(false)
    },
    [searchParams, pathname, router],
  )

  const getActiveFilterLabels = useMemo(() => {
    const labels: string[] = []

    if (activeFilters.meatType.length > 0) {
      labels.push(...activeFilters.meatType)
    }
    if (activeFilters.cutFamily.length > 0) {
      labels.push(...activeFilters.cutFamily)
    }
    if (activeFilters.occasion.length > 0) {
      labels.push(...activeFilters.occasion)
    }
    if (activeFilters.department.length > 0) {
      labels.push(...activeFilters.department)
    }
    if (activeFilters.deliType.length > 0) {
      labels.push(...activeFilters.deliType)
    }
    if (activeFilters.spiceFamily.length > 0) {
      labels.push(...activeFilters.spiceFamily)
    }
    if (activeFilters.braaiGearFamily.length > 0) {
      labels.push(...activeFilters.braaiGearFamily)
    }
    if (activeFilters.groceryFamily.length > 0) {
      labels.push(...activeFilters.groceryFamily)
    }
    if (activeFilters.bulkType.length > 0) {
      labels.push(...activeFilters.bulkType)
    }

    return labels
  }, [activeFilters])

  const hasActiveFilters = getActiveFilterLabels.length > 0

  const collectionUrl = useMemo(() => {
    const params = searchParams.toString()
    return params ? `${pathname}?${params}` : pathname
  }, [pathname, searchParams.toString()])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <Link href="/collections/all" className="block mb-6">
            <button className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
              Shop All
            </button>
          </Link>

          <CollectionFilterSidebar
            initialFilters={activeFilters}
            availableFilters={availableFilters}
            onFiltersChange={handleFiltersChange}
            collectionHandle={collectionHandle}
          />
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <div className="lg:hidden space-y-3">
              <Link href="/collections/all" className="block">
                <button className="w-full px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Shop All
                </button>
              </Link>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex-1 px-4 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                  Filters {hasActiveFilters && `(${getActiveFilterLabels.length})`}
                </button>
                <button
                  onClick={() => setIsMobileSortOpen(!isMobileSortOpen)}
                  className="flex-1 px-4 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                  Sort
                </button>
                <div className="flex items-center gap-1 border-2 border-brand-primary rounded-lg p-0.5">
                  <button
                    onClick={() => handleMobileGridChange(2)}
                    className={`p-2.5 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      mobileGridCols === 2 ? "bg-brand-red text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                    aria-label="2-column view"
                    aria-pressed={mobileGridCols === 2}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMobileGridChange(1)}
                    className={`p-2.5 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      mobileGridCols === 1 ? "bg-brand-red text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                    aria-label="1-column view"
                    aria-pressed={mobileGridCols === 1}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isMobileSortOpen && (
                <div
                  ref={sortPopoverRef}
                  className="mb-3 bg-white border border-slate-300 rounded-xl shadow-lg overflow-hidden"
                >
                  {[
                    { value: "featured", label: "Featured" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "name-az", label: "Name: A to Z" },
                    { value: "name-za", label: "Name: Z to A" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between min-h-[44px] transition-colors ${
                        sortBy === option.value
                          ? "bg-brand-red text-white font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && <Check className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-3">
                <p className="text-slate-600 text-sm text-center">
                  {displayTotal === 0 ? (
                    "No products"
                  ) : (
                    <>
                      Showing {displayStart}–{displayEnd} of {displayTotal}
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
                {displayTotal === 0 ? (
                  "No products"
                ) : (
                  <>
                    Showing {displayStart}–{displayEnd} of {displayTotal}
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
                  onChange={(e) => handleSortChange(e.target.value)}
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

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={collectionUrl}
              className="mb-6 lg:hidden"
              mobileSimple
            />
          )}

          <ProductGrid
            products={paginatedProducts}
            gridDensity={gridDensity}
            collectionUrl={collectionUrl}
            mobileGridCols={mobileGridCols}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={collectionUrl}
              className="mt-8"
              mobileSimple={false}
            />
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <CollectionFilterSidebar
          initialFilters={activeFilters}
          availableFilters={availableFilters}
          onFiltersChange={(filters) => {
            handleFiltersChange(filters)
          }}
          collectionHandle={collectionHandle}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)}
        />
      </div>
    </main>
  )
}
