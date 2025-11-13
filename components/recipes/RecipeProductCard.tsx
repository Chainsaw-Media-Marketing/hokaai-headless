"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Product, ShopifyVariant } from "@/lib/types"

interface RecipeProductCardProps {
  product: Product
  isSelected: boolean
  onToggleSelect: () => void
  note?: string
}

const shouldShowVariantSelector = (variants?: ShopifyVariant[]): boolean => {
  if (!variants || variants.length === 0) return false
  if (variants.length === 1 && variants[0].title === "Default Title") {
    return false
  }
  return true
}

export function RecipeProductCard({ product, isSelected, onToggleSelect, note }: RecipeProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null
    return product.variants.find((v) => v.availableForSale) || product.variants[0]
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const minPrice = product.minVariantPrice || product.pricePerKg
  const showVariantSelector = shouldShowVariantSelector(product.variants)

  return (
    <div className="flex items-start space-x-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all">
      {/* Checkbox */}
      <button
        onClick={onToggleSelect}
        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
          isSelected ? "bg-brand-red border-brand-red" : "border-slate-300 hover:border-slate-400"
        }`}
        aria-label={isSelected ? "Deselect product" : "Select product"}
      >
        {isSelected && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.handle}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.handle}`}>
          <h4 className="font-semibold text-brand-primary hover:text-brand-red transition-colors line-clamp-2 mb-1">
            {product.title}
          </h4>
        </Link>
        {note && <p className="text-sm text-slate-600 mb-2">{note}</p>}
        <div className="mb-2">
          <p className="text-slate-700 text-sm font-semibold">{formatPrice(minPrice)}</p>
          {product.price_per_kg && <p className="text-slate-500 text-xs">{formatPrice(product.price_per_kg)} / kg</p>}
        </div>

        {/* Variant Selector */}
        {showVariantSelector && (
          <select
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
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
      </div>
    </div>
  )
}
