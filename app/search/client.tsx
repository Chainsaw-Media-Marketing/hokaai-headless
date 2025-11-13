"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { CollectionFilterSidebar } from "@/components/collection-filter-sidebar"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/types"
import type { FilterState } from "@/lib/filter-utils"
import { buildAvailableFilters, applyFilters } from "@/lib/filter-utils"
import { LayoutGrid, Grid3x3 } from "lucide-react"

interface SearchPageClientProps {
  query: string
  products: Product[]
  initialFilters?: FilterState
}

// Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[b.length][a.length]
}

// Search and rank products by relevance
function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products

  const searchTerm = query.toLowerCase().trim()
  const searchWords = searchTerm.split(/\s+/)

  const scoredProducts = products.map((product) => {
    let score = 0
    const title = product.title.toLowerCase()
    const handle = product.handle.toLowerCase()
    const tags = (product.tags || []).map((t) => t.toLowerCase())
    const productType = (product.productType || "").toLowerCase()
    const vendor = (product.vendor || "").toLowerCase()

    // Exact title match (highest priority)
    if (title === searchTerm) {
      score += 1000
    }
    // Title contains exact phrase
    else if (title.includes(searchTerm)) {
      score += 500
    }
    // Title starts with search term
    else if (title.startsWith(searchTerm)) {
      score += 400
    }
    // All search words in title
    else if (searchWords.every((word) => title.includes(word))) {
      score += 300
    }
    // Some search words in title
    else {
      const matchingWords = searchWords.filter((word) => title.includes(word))
      score += matchingWords.length * 50
    }

    // Typo tolerance (1 edit distance) for title
    const titleWords = title.split(/\s+/)
    for (const titleWord of titleWords) {
      for (const searchWord of searchWords) {
        if (searchWord.length > 3 && levenshteinDistance(titleWord, searchWord) === 1) {
          score += 100
        }
      }
    }

    // Handle exact match
    if (handle === searchTerm || handle.includes(searchTerm)) {
      score += 200
    }

    // Tags match
    if (tags.some((tag) => tag === searchTerm)) {
      score += 150
    } else if (tags.some((tag) => tag.includes(searchTerm))) {
      score += 75
    }

    // Product type match
    if (productType === searchTerm || productType.includes(searchTerm)) {
      score += 100
    }

    // Vendor match
    if (vendor === searchTerm || vendor.includes(searchTerm)) {
      score += 100
    }

    // Metafield matches
    const metafields = [
      product.department,
      product.meat_type,
      product.cut_family,
      product.spice_family,
      product.braai_gear_family,
      product.grocery_family,
      product.bulk_type,
      product.deli_type,
    ].filter(Boolean)

    for (const metafield of metafields) {
      const metafieldLower = (metafield || "").toLowerCase()
      if (metafieldLower === searchTerm || metafieldLower.includes(searchTerm)) {
        score += 50
      }
    }

    return { product, score }
  })

  // Filter out products with score 0 and sort by score descending
  return scoredProducts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product)
}

export function SearchPageClient({ query, products, initialFilters }: SearchPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [activeFilters, setActiveFilters] = useState<FilterState>(
    initialFilters || {
      meatType: [],
      cutFamily: [],
      occasion: [],
      department: [],
      deliType: [],
      spiceFamily: [],
      braaiGearFamily: [],
      groceryFamily: [],
      bulkType: [],
    },
  )

  // Search products first
  const searchResults = useMemo(() => {
    return searchProducts(products, query)
  }, [products, query])

  // Then apply filters to search results
  const filteredProducts = useMemo(() => {
    return applyFilters(searchResults, activeFilters)
  }, [searchResults, activeFilters])

  const availableFilters = useMemo(() => {
    return buildAvailableFilters(searchResults, activeFilters)
  }, [searchResults, activeFilters])

  // Sync filters from URL
  useEffect(() => {
    const filtersFromUrl: FilterState = {
      meatType: searchParams.get("meat_type")?.split(",").filter(Boolean) || [],
      cutFamily: searchParams.get("cut_family")?.split(",").filter(Boolean) || [],
      occasion: searchParams.get("occasion")?.split(",").filter(Boolean) || [],
      department: searchParams.get("department")?.split(",").filter(Boolean) || [],
      deliType: searchParams.get("deli_type")?.split(",").filter(Boolean) || [],
      spiceFamily: searchParams.get("spice_family")?.split(",").filter(Boolean) || [],
      braaiGearFamily: searchParams.get("braai_gear_family")?.split(",").filter(Boolean) || [],
      groceryFamily: searchParams.get("grocery_family")?.split(",").filter(Boolean) || [],
      bulkType: searchParams.get("bulk_type")?.split(",").filter(Boolean) || [],
    }

    const currentFiltersJson = JSON.stringify(activeFilters)
    const newFiltersJson = JSON.stringify(filtersFromUrl)

    if (currentFiltersJson !== newFiltersJson) {
      setActiveFilters(filtersFromUrl)
    }
  }, [searchParams])

  const [gridDensity, setGridDensity] = useState<"comfortable" | "compact">("comfortable")
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name-az" | "name-za">("featured")

  useEffect(() => {
    const sortParam = searchParams.get("sort")
    if (sortParam === "price-low" || sortParam === "price-high" || sortParam === "name-az" || sortParam === "name-za") {
      setSortBy(sortParam)
    } else {
      setSortBy("featured")
    }
  }, [searchParams])

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

  const handleFiltersChange = (filters: FilterState) => {
    // Update state immediately
    setActiveFilters(filters)

    // Build URL with filters
    const params = new URLSearchParams()

    // Always keep the search query
    if (query) {
      params.set("type", "product")
      params.set("q", query)
    }

    const currentSort = searchParams.get("sort")
    if (currentSort && currentSort !== "featured") {
      params.set("sort", currentSort)
    }

    // Add filter params
    if (filters.department.length > 0) {
      params.set("department", filters.department.join(","))
    }
    if (filters.meatType.length > 0) {
      params.set("meat_type", filters.meatType.join(","))
    }
    if (filters.cutFamily.length > 0) {
      params.set("cut_family", filters.cutFamily.join(","))
    }
    if (filters.deliType.length > 0) {
      params.set("deli_type", filters.deliType.join(","))
    }
    if (filters.spiceFamily.length > 0) {
      params.set("spice_family", filters.spiceFamily.join(","))
    }
    if (filters.braaiGearFamily.length > 0) {
      params.set("braai_gear_family", filters.braaiGearFamily.join(","))
    }
    if (filters.groceryFamily.length > 0) {
      params.set("grocery_family", filters.groceryFamily.join(","))
    }
    if (filters.bulkType.length > 0) {
      params.set("bulk_type", filters.bulkType.join(","))
    }
    if (filters.occasion.length > 0) {
      params.set("occasion", filters.occasion.join(","))
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)
  }

  const handleSortChange = (newSortBy: "featured" | "price-low" | "price-high" | "name-az" | "name-za") => {
    setSortBy(newSortBy)

    const params = new URLSearchParams(searchParams.toString())

    if (newSortBy === "featured") {
      params.delete("sort")
    } else {
      params.set("sort", newSortBy)
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <CollectionFilterSidebar
              initialFilters={activeFilters}
              availableFilters={availableFilters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="font-heading font-bold text-3xl text-brand-primary mb-2">Search Results</h1>
              {query && <p className="text-slate-600 mb-4">Showing results for "{query}"</p>}
              <div className="flex items-center justify-between">
                <p className="text-slate-700">
                  {sortedProducts.length === 0 ? (
                    "No products"
                  ) : (
                    <>
                      Showing {sortedProducts.length} product
                      {sortedProducts.length !== 1 ? "s" : ""}
                    </>
                  )}
                </p>

                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex items-center gap-1 border border-slate-300 rounded-lg p-1">
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
                      handleSortChange(
                        e.target.value as "featured" | "price-low" | "price-high" | "name-az" | "name-za",
                      )
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

            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg mb-6">
                  {query ? `No products found matching "${query}"` : "No products found matching your criteria."}
                </p>
                <div className="space-y-4">
                  <p className="text-slate-600 font-semibold">Quick links to popular departments:</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <a
                      href="/collections/all?department=butchery"
                      className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Butchery
                    </a>
                    <a
                      href="/collections/all?department=deli-biltong"
                      className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Deli & Biltong
                    </a>
                    <a
                      href="/collections/all?department=spices-sauces"
                      className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Spices & Sauces
                    </a>
                    <a
                      href="/collections/all?department=braai-gear"
                      className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Braai Gear
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <ProductGrid products={sortedProducts} showQuickAdd gridDensity={gridDensity} collectionUrl="/search" />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
