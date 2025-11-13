"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RecipeProductCard } from "./RecipeProductCard"
import { getRecipeProducts } from "@/app/actions/get-recipe-products"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { addToCartAndHydrate } from "@/lib/cart-actions"

interface StockedItem {
  handle: string
  qty: number
  unit?: string
  note?: string
}

interface ShopIngredientsProps {
  items: StockedItem[]
  recipeSlug: string
}

export function ShopIngredients({ items, recipeSlug }: ShopIngredientsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHandles, setSelectedHandles] = useState<Set<string>>(new Set(items.map((item) => item.handle)))
  const { dispatch } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const handles = items.map((item) => item.handle)
      const fetchedProducts = await getRecipeProducts(handles)
      setProducts(fetchedProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [items])

  const toggleItem = (handle: string) => {
    const newSelected = new Set(selectedHandles)
    if (newSelected.has(handle)) {
      newSelected.delete(handle)
    } else {
      newSelected.add(handle)
    }
    setSelectedHandles(newSelected)
  }

  const handleAddToCart = async (selectedOnly: boolean) => {
    const productsToAdd = selectedOnly ? products.filter((p) => selectedHandles.has(p.handle)) : products

    if (productsToAdd.length === 0) {
      console.log("[recipes] No items to add")
      return
    }

    try {
      setIsAdding(true)

      // Build lines array for batch add
      const lines = productsToAdd
        .map((product) => {
          const variant = product.variants?.find((v) => v.availableForSale)
          if (!variant) return null

          const stockedItem = items.find((item) => item.handle === product.handle)
          const recipeQuantity = stockedItem?.qty || 1

          return {
            variantId: variant.id,
            quantity: recipeQuantity,
          }
        })
        .filter((line): line is NonNullable<typeof line> => line !== null)

      if (lines.length === 0) {
        console.log("[recipes] No available variants")
        return
      }

      // Single API call for all items
      await addToCartAndHydrate({ lines })
    } catch (err) {
      console.error("[recipes] ADD ERR:", err)
    } finally {
      setIsAdding(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-brand-primary mb-2">Shop these ingredients</h2>
        <p className="text-sm text-muted-foreground mb-4">Loading products...</p>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.handle} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-primary mb-2">Shop these ingredients</h2>
      <p className="text-sm text-muted-foreground mb-4">These are Hokaai products used in this recipe.</p>

      <div className="space-y-3 mb-4">
        {products.map((product) => {
          const stockedItem = items.find((item) => item.handle === product.handle)
          const note = stockedItem ? `${stockedItem.qty} ${stockedItem.unit || ""}`.trim() : undefined

          return (
            <RecipeProductCard
              key={product.handle}
              product={product}
              isSelected={selectedHandles.has(product.handle)}
              onToggleSelect={() => toggleItem(product.handle)}
              note={note}
            />
          )
        })}
      </div>

      <div className="flex gap-2 pt-3">
        <Button
          size="sm"
          className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => handleAddToCart(true)}
          disabled={selectedHandles.size === 0 || isAdding}
        >
          {isAdding ? "Adding..." : "Add Selected"}
        </Button>
        <Button
          size="sm"
          className="flex-1 border-2 border-brand-red text-brand-red bg-transparent hover:bg-brand-red/10 rounded-lg transition-all duration-200 hover:scale-105"
          onClick={() => handleAddToCart(false)}
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add All"}
        </Button>
      </div>
    </div>
  )
}
