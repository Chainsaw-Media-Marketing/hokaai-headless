"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, ShoppingCart, Info } from 'lucide-react'
import { PlusIcon } from "@/components/icons/Plus"
import type { Product, ShopifyVariant } from "@/lib/types"
import { addToCartAndHydrate } from "@/lib/cart-actions"
import { isBulkProduct } from "@/lib/product-flags"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface ProductDetailsProps {
  product: Product
}

const shouldShowVariantSelector = (variants?: ShopifyVariant[]): boolean => {
  if (!variants || variants.length === 0) return false

  // Hide if only one variant with "Default Title"
  if (variants.length === 1 && variants[0].title === "Default Title") {
    return false
  }

  // Show if 2+ variants OR 1 variant with meaningful title
  return true
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null
    // Default to first available variant, or first variant if none available
    return product.variants.find((v) => v.availableForSale) || product.variants[0]
  })
  const [quantity, setQuantity] = useState(1)
  const [householdSize, setHouseholdSize] = useState<string>("not-specified")
  const [specialRequests, setSpecialRequests] = useState<string>("")
  const [isAdding, setIsAdding] = useState(false)
  
  const [moisturePreference, setMoisturePreference] = useState<string>("")
  const [fatPreference, setFatPreference] = useState<string>("")

  const isBiltong = (() => {
    if (!product.deli_type) return false
    
    if (Array.isArray(product.deli_type)) {
      return product.deli_type.includes("biltong")
    }
    
    if (typeof product.deli_type === "string") {
      if (product.deli_type === "biltong") return true
      
      try {
        const parsed = JSON.parse(product.deli_type)
        if (Array.isArray(parsed)) {
          return parsed.includes("biltong")
        }
      } catch {
        return false
      }
    }
    
    return false
  })()

  if (isBiltong) {
    console.log("[v0] Biltong options injected for", product.handle)
  }

  const showVariantSelector = shouldShowVariantSelector(product.variants)
  const isBulk = isBulkProduct(product)

  console.log("[v0] ProductDetails - product.title:", product.title)
  console.log("[v0] ProductDetails - product.bulk_type:", product.bulk_type)
  console.log("[v0] ProductDetails - typeof product.bulk_type:", typeof product.bulk_type)
  console.log("[v0] ProductDetails - Array.isArray(product.bulk_type):", Array.isArray(product.bulk_type))
  if (Array.isArray(product.bulk_type)) {
    console.log("[v0] ProductDetails - product.bulk_type.includes('hamper'):", product.bulk_type.includes("hamper"))
  }

  const isHamper = (() => {
    if (!product.bulk_type) return false

    // If it's already an array, check directly
    if (Array.isArray(product.bulk_type)) {
      return product.bulk_type.includes("hamper")
    }

    // If it's a string, try to parse it as JSON
    if (typeof product.bulk_type === "string") {
      // Check if it's a plain string "hamper"
      if (product.bulk_type === "hamper") return true

      // Try to parse as JSON array
      try {
        const parsed = JSON.parse(product.bulk_type)
        if (Array.isArray(parsed)) {
          return parsed.includes("hamper")
        }
      } catch {
        // If parsing fails, it's just a regular string, not JSON
        return false
      }
    }

    return false
  })()

  console.log("[v0] ProductDetails - isHamper result:", isHamper)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const getWeightInKg = (variant: ShopifyVariant | null): number | null => {
    if (!variant) return null

    // Convert variant weight to kg based on weightUnit
    if (variant.weight && variant.weight > 0) {
      if (variant.weightUnit === "GRAMS") {
        return variant.weight / 1000
      } else if (variant.weightUnit === "KILOGRAMS") {
        return variant.weight
      }
    }

    return null
  }

  const usePricePerKg = product.price_per_kg && product.price_per_kg > 0
  const weightInKg = getWeightInKg(selectedVariant)

  let displayTotal = 0
  let pricePerKg = 0

  if (usePricePerKg && weightInKg && weightInKg > 0) {
    // Mode A: Price per KG × Weight (kg) × Quantity
    // This applies to butchery AND deli-biltong products with price_per_kg metafield
    pricePerKg = product.price_per_kg
    displayTotal = pricePerKg * weightInKg * quantity
  } else if (selectedVariant) {
    // Mode B: Variant Price × Quantity (fallback when no price_per_kg or no weight)
    displayTotal = Number.parseFloat(selectedVariant.price.amount) * quantity
  } else {
    // Fallback to product base price
    displayTotal = product.pricePerKg * quantity
  }

  const getOccasionChips = (tags: string[]) => {
    const occasionTags = tags.filter((tag) =>
      ["braai", "stew", "roast", "quick", "marinated", "ready-to-braai"].includes(tag),
    )
    return occasionTags
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return

    try {
      setIsAdding(true)

      const attributes: Array<{ key: string; value: string }> = []
      if (isBulk && householdSize !== "not-specified") {
        attributes.push({ key: "household_size", value: householdSize })
      }
      if (isHamper && specialRequests.trim().length > 0) {
        attributes.push({ key: "special_requests", value: specialRequests.trim() })
      }
      if (isBiltong && moisturePreference) {
        attributes.push({ key: "moisture_preference", value: moisturePreference })
      }
      if (isBiltong && fatPreference) {
        attributes.push({ key: "fat_preference", value: fatPreference })
      }

      await addToCartAndHydrate({
        lines: [
          {
            variantId: selectedVariant.id,
            quantity,
            attributes: attributes.length > 0 ? attributes : undefined,
          },
        ],
      })
    } catch (err) {
      console.error("[product-details] ADD ERR:", err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title and Occasion Chips */}
      <div>
        <div className="mb-3">
          {getOccasionChips(product.tags).map((tag) => (
            <span
              key={tag}
              className="inline-block bg-brand-red text-white text-xs font-semibold px-3 py-1 rounded-full mr-2 mb-1 capitalize"
            >
              {tag === "ready-to-braai" ? "Ready to Braai" : tag}
            </span>
          ))}
        </div>
        <h1 className="text-h2 font-heading font-bold text-brand-primary mb-4">{product.title}</h1>
      </div>

      {/* Price */}
      <div className="border-b border-slate-200 pb-6">
        <div className="text-3xl font-bold text-brand-primary mb-2">
          From {formatPrice(product.minVariantPrice || product.pricePerKg)}
        </div>
        {product.price_per_kg && (
          <div className="text-lg text-slate-700 mb-2">Price per kg: {formatPrice(product.price_per_kg)}</div>
        )}
        <div
          className="text-slate-700 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
      </div>

      {/* Selectors */}
      <div className="space-y-6">
        {showVariantSelector && (
          <div>
            <label className="text-label text-slate-700 mb-3 block">Weight</label>
            <div className="flex-1">
              <select
                value={selectedVariant?.id || ""}
                onChange={(e) => {
                  const variant = product.variants?.find((v) => v.id === e.target.value)
                  if (variant) setSelectedVariant(variant)
                }}
                className="w-full px-4 py-3 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success"
              >
                {product.variants?.map((variant) => (
                  <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                    {variant.title}
                    {!variant.availableForSale ? " (Sold out)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div>
          <label className="text-label text-slate-700 mb-3 block">Quantity (# of packs)</label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-2 border border-slate-400 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-400 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-brand-success"
                min="1"
                max="20"
              />
            </div>
            {/* DO NOT MODIFY: using approved + icon component */}
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-2 border border-slate-400 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity >= 20}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isBiltong && (
          <>
            <div>
              <label className="text-label text-slate-700 mb-3 block">Moisture Preference</label>
              <select
                value={moisturePreference}
                onChange={(e) => setMoisturePreference(e.target.value)}
                className="w-full px-4 py-3 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success"
              >
                <option value="">Select preference</option>
                <option value="Wet">Wet</option>
                <option value="Dry">Dry</option>
              </select>
            </div>

            <div>
              <label className="text-label text-slate-700 mb-3 block">Fat Preference</label>
              <select
                value={fatPreference}
                onChange={(e) => setFatPreference(e.target.value)}
                className="w-full px-4 py-3 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success"
              >
                <option value="">Select preference</option>
                <option value="With Fat">With Fat</option>
                <option value="No Fat">No Fat</option>
              </select>
            </div>
          </>
        )}

        {isBulk && (
          <div>
            <label className="text-label text-slate-700 mb-3 flex items-center gap-2">
              Household size (optional)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-success focus:ring-offset-2 rounded-full"
                      aria-label="Household size information"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      This helps us portion your bulk or hamper pack correctly for your household size. Leave blank if
                      not applicable.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <select
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              className="w-full px-4 py-3 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success"
            >
              <option value="not-specified">Not specified</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
            </select>
          </div>
        )}

        {isHamper && (
          <div>
            <label className="text-label text-slate-700 mb-3 block">Special requests (optional)</label>
            <textarea
              value={specialRequests}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 250) {
                  setSpecialRequests(value)
                }
              }}
              placeholder="E.g., extra biltong, no pork products, specific portion requests..."
              className="w-full px-4 py-3 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success resize-none"
              rows={3}
              maxLength={250}
            />
            <p className="text-xs text-slate-500 mt-1">{specialRequests.length}/250 characters</p>
          </div>
        )}

        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-brand-primary">Estimated Total:</span>
            <span className="text-2xl font-bold text-brand-primary">{formatPrice(displayTotal)}</span>
          </div>

          {usePricePerKg && weightInKg && weightInKg > 0 ? (
            // Mode A: Show price per kg calculation
            <div className="text-sm text-slate-600 space-y-1">
              <p className="font-mono">
                {formatPrice(pricePerKg)} × {weightInKg.toFixed(2)} kg × {quantity} = {formatPrice(displayTotal)}
              </p>
              <p className="text-xs text-slate-500">Price per kg: {formatPrice(pricePerKg)}</p>
            </div>
          ) : selectedVariant ? (
            // Mode B: Show fixed price calculation
            <p className="text-sm text-slate-600">
              {quantity} × {formatPrice(Number.parseFloat(selectedVariant.price.amount))} = {formatPrice(displayTotal)}
            </p>
          ) : (
            // Fallback
            <p className="text-sm text-slate-600">
              {quantity} × {formatPrice(product.pricePerKg)} = {formatPrice(displayTotal)}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button
          size="lg"
          className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold"
          onClick={handleAddToCart}
          disabled={!selectedVariant?.availableForSale || isAdding}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isAdding ? "Adding..." : selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>

      {/* Product Notes */}
      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-sm text-slate-700">
          <strong>Note:</strong> All products are cut fresh to order. Images are for illustrative purposes only and may
          differ slightly from the actual product. Actual weight may vary due to natural product variation.
        </p>
      </div>

      {/* Stock Status */}
      {selectedVariant?.availableForSale ? (
        <div className="flex items-center text-brand-success">
          <div className="w-2 h-2 bg-brand-success rounded-full mr-2"></div>
          <span className="text-sm font-semibold">In Stock</span>
        </div>
      ) : (
        <div className="flex items-center text-brand-danger">
          <div className="w-2 h-2 bg-brand-danger rounded-full mr-2"></div>
          <span className="text-sm font-semibold">Out of Stock</span>
        </div>
      )}
    </div>
  )
}
