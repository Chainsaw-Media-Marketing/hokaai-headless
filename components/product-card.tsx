"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { Product, ShopifyVariant } from "@/lib/types"
import { addToCartAndHydrate } from "@/lib/cart-actions"
import { trackMetaPixelEvent } from "@/lib/metaPixel"

interface ProductCardProps {
  product: Product
  showQuickAdd?: boolean
  showCategoryLink?: boolean
  collectionUrl?: string
}

const generateFilterUrl = (filters: { meat_type?: string; cut_family?: string; occasion?: string[] }) => {
  const baseUrl = "/collections/all"
  const params = new URLSearchParams()

  if (filters.meat_type) {
    params.append("filter.p.m.custom.meat_type", encodeURIComponent(filters.meat_type))
  }

  if (filters.cut_family) {
    params.append("filter.p.m.custom.cut_family", encodeURIComponent(filters.cut_family))
  }

  if (filters.occasion) {
    filters.occasion.forEach((o) => {
      params.append("filter.p.m.custom.occasion", encodeURIComponent(o))
    })
  }

  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
}

const getCategoryFiltersFromProduct = (tags: string[]) => {
  const filters: { meat_type?: string; cut_family?: string; occasion?: string[] } = {}

  const meatTypeMap: { [key: string]: string } = {
    beef: "Beef",
    lamb: "Lamb",
    pork: "Pork",
    chicken: "Chicken",
    wors: "Wors",
    biltong: "Deli",
    deli: "Deli",
  }

  const occasionMap: { [key: string]: string } = {
    braai: "Braai",
    stew: "Stew",
    roast: "Roasts",
    quick: "Quick",
    marinated: "ReadyToBraai",
    "ready-to-braai": "ReadyToBraai",
  }

  for (const tag of tags) {
    if (meatTypeMap[tag]) {
      filters.meat_type = meatTypeMap[tag]
      break
    }
  }

  const occasions: string[] = []
  for (const tag of tags) {
    if (occasionMap[tag]) {
      occasions.push(occasionMap[tag])
    }
  }
  if (occasions.length > 0) {
    filters.occasion = occasions
  }

  return filters
}

const shouldShowVariantSelector = (variants?: ShopifyVariant[]): boolean => {
  if (!variants || variants.length === 0) return false
  if (variants.length === 1 && variants[0].title === "Default Title") {
    return false
  }
  return true
}

export function ProductCard({
  product,
  showQuickAdd = false,
  showCategoryLink = false,
  collectionUrl,
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null
    return product.variants.find((v) => v.availableForSale) || product.variants[0]
  })
  const [isAdding, setIsAdding] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const minPrice = product.minVariantPrice || product.pricePerKg

  const getProductLink = () => {
    if (showCategoryLink) {
      const filters = getCategoryFiltersFromProduct(product.tags)
      return generateFilterUrl(filters)
    }
    const baseUrl = `/products/${product.handle}`
    if (collectionUrl) {
      return `${baseUrl}?ref=${encodeURIComponent(collectionUrl)}`
    }
    return baseUrl
  }

  const handleProductClick = () => {
    if (collectionUrl && typeof window !== "undefined" && window.sessionStorage) {
      try {
        const scrollKey = `scroll-${collectionUrl}`
        const scrollY = window.scrollY
        sessionStorage.setItem(scrollKey, scrollY.toString())
      } catch (error) {
        console.error("[v0] Failed to save scroll position:", error)
      }
    }
  }

  const isButchery = product.department?.toLowerCase().includes("butchery")
  const isDeli =
    product.department?.toLowerCase().includes("deli") || product.department?.toLowerCase().includes("biltong")

  const productLink = getProductLink()
  const showVariantSelector = shouldShowVariantSelector(product.variants)

  const getWeightInKg = (variant: ShopifyVariant | null): number | null => {
    if (!variant) return null

    if (variant.weight && variant.weight > 0) {
      if (variant.weightUnit === "GRAMS") {
        return variant.weight / 1000
      } else if (variant.weightUnit === "KILOGRAMS") {
        return variant.weight
      }
    }

    return null
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return

    try {
      setIsAdding(true)

      const value = Number.parseFloat(selectedVariant.price.amount)
      const currency = selectedVariant.price.currencyCode || "ZAR"

      trackMetaPixelEvent("AddToCart", {
        content_ids: [selectedVariant.id],
        content_type: "product",
        value,
        currency,
        num_items: 1,
      })

      await addToCartAndHydrate({
        lines: [
          {
            variantId: selectedVariant.id,
            quantity: 1,
          },
        ],
      })
    } catch (err) {
      console.error("[product-card] ADD ERR:", err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="card group">
      <Link href={productLink} onClick={handleProductClick}>
        <div className="aspect-[4/3] lg:aspect-square relative overflow-hidden rounded-t-2xl bg-white">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-contain lg:object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-2.5 lg:p-3">
        <div className="mb-2 hidden lg:flex flex-wrap gap-1.5">
          {isButchery && (
            <>
              {product.meat_type && (
                <span className="inline-block bg-slate-200 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md">
                  {product.meat_type}
                </span>
              )}
              {product.cut_family && (
                <span className="inline-block bg-slate-200 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md">
                  {product.cut_family}
                </span>
              )}
            </>
          )}
          {isDeli && (
            <>
              {product.deli_type && (
                <span className="inline-block bg-slate-200 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md">
                  {product.deli_type}
                </span>
              )}
              {product.department && (
                <span className="inline-block bg-slate-200 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md">
                  {product.department}
                </span>
              )}
            </>
          )}
        </div>

        <div className="mb-0.5 min-h-[20px] hidden lg:block">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full mr-2 mb-1 capitalize"
            >
              {tag === "ready-to-braai" ? "Ready to Braai" : tag}
            </span>
          ))}
        </div>

        <Link href={productLink} onClick={handleProductClick}>
          <h3 className="font-heading font-semibold text-base lg:text-lg text-brand-primary mb-1 group-hover:text-brand-red transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="mb-1.5 lg:mb-2">
          <p className="text-slate-700 text-sm">From {formatPrice(minPrice)}</p>
          {product.price_per_kg && <p className="text-slate-500 text-xs">{formatPrice(product.price_per_kg)} / kg</p>}
        </div>

        {showQuickAdd ? (
          <div className="flex flex-col space-y-1.5 lg:space-y-2">
            {showVariantSelector && (
              <select
                className="w-full px-3 py-1.5 lg:py-2 border border-slate-400 rounded-lg text-sm"
                value={selectedVariant?.id || ""}
                onChange={(e) => {
                  const variant = product.variants?.find((v) => v.id === e.target.value)
                  if (variant) setSelectedVariant(variant)
                }}
              >
                {product.variants?.map((variant) => (
                  <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                    {variant.title}
                    {!variant.availableForSale ? " (Sold out)" : ""}
                  </option>
                ))}
              </select>
            )}
            <Button
              size="sm"
              className="w-full h-11 bg-brand-red hover:bg-brand-red/90 text-white rounded-lg"
              disabled={!selectedVariant?.availableForSale || isAdding}
              onClick={handleAddToCart}
            >
              {isAdding ? "Adding..." : "Add"}
            </Button>
          </div>
        ) : (
          <Link href={productLink} onClick={handleProductClick}>
            <Button variant="secondary" size="sm" className="w-full h-11">
              {showCategoryLink ? "Shop Category" : "View"}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
