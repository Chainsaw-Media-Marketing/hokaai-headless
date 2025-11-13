"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { getUpsellProducts } from "@/app/actions/get-upsell-products"
import { refreshAndGetCheckoutUrl, goToCheckout } from "@/lib/shopifyClient"
import { PlusIcon } from "@/components/icons/Plus"
import { updateCartQuantityAndHydrate, removeCartLineAndHydrate, clearCartAndHydrate } from "@/lib/cart-actions"

const XIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const MinusIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
)

const ShoppingBagIcon = () => (
  <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
    />
  </svg>
)

const TruckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 001 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
    />
  </svg>
)

export function CartDrawer() {
  const { state, dispatch } = useCart()
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([])
  const [checkoutBusy, setCheckoutBusy] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const router = useRouter()

  // Diagnostic logging to track cart state updates
  console.log("[drawer] cart state", state)

  useEffect(() => {
    if (state.isOpen) {
      const cartProductHandles = state.items.map((item) => item.productHandle)
      getUpsellProducts(cartProductHandles)
        .then((products) => {
          setUpsellProducts(products)
        })
        .catch((error) => {
          console.error("[v0] Error fetching upsell products:", error)
        })
    }
  }, [state.isOpen, state.items])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatWeight = (weightGrams?: number) => {
    if (!weightGrams) return null

    if (weightGrams < 1000) {
      return `${weightGrams} g`
    } else {
      const kg = weightGrams / 1000
      return `${kg.toFixed(2).replace(/\.?0+$/, "")} kg`
    }
  }

  const formatPricePerKg = (price: number) => {
    return `R ${price.toFixed(2)}`
  }

  const freeDeliveryThreshold = 800
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - state.total)
  const progressPercentage = Math.min(100, (state.total / freeDeliveryThreshold) * 100)

  const navTo = (url: string) => {
    try {
      if (window.top) {
        window.top.location.href = url
      } else {
        window.location.href = url
      }
    } catch {
      window.location.href = url
    }
  }

  const handleCheckout = async () => {
    setCheckoutError(null)
    setCheckoutBusy(true)
    try {
      const url = await refreshAndGetCheckoutUrl()
      console.log("[checkout] using checkoutUrl:", url)
      goToCheckout(url)
    } catch (e) {
      console.error("[v0] Checkout error:", e)
      setCheckoutError("We couldn't start checkout. Please try again.")
      setCheckoutBusy(false)
    }
  }

  const handleViewProduct = (handle: string) => {
    dispatch({ type: "CLOSE_CART" })
    router.push(`/products/${handle}`)
  }

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove the item
      await handleRemoveItem(lineId)
      return
    }

    try {
      // Update quantity via API and rehydrate
      await updateCartQuantityAndHydrate(lineId, newQuantity)
    } catch (error) {
      console.error("[v0] Failed to update quantity:", error)
    }
  }

  const handleRemoveItem = async (lineId: string) => {
    try {
      await removeCartLineAndHydrate(lineId)
    } catch (error) {
      console.error("[v0] Failed to remove item:", error)
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCartAndHydrate()
    } catch (error) {
      console.error("[v0] Failed to clear cart:", error)
    }
  }

  if (!state.isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch({ type: "CLOSE_CART" })}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white z-50 flex flex-col shadow-2xl"
        data-diag={`itemCount:${state.itemCount} lineCount:${state.lineCount || 0}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="font-heading font-semibold text-xl text-brand-primary">Your Cart ({state.itemCount})</h2>
          <button
            onClick={() => dispatch({ type: "CLOSE_CART" })}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {state.itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-slate-300 mb-4">
                <ShoppingBagIcon />
              </div>
              <h3 className="font-semibold text-lg text-slate-700 mb-2">Your cart is empty</h3>
              <p className="text-slate-500 mb-6">Add some delicious meats to get started!</p>
              <Button onClick={() => dispatch({ type: "CLOSE_CART" })}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Free Delivery Progress */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-brand-red">
                      <TruckIcon />
                    </div>
                    <span className="text-sm font-semibold text-brand-primary">Free Delivery</span>
                  </div>
                  <span className="text-sm text-slate-600">
                    {remainingForFreeDelivery > 0 ? `${formatPrice(remainingForFreeDelivery)} to go` : "Qualified!"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-brand-success h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="text-brand-red text-sm font-medium hover:underline transition-all"
                >
                  Clear Cart
                </button>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex space-x-4 p-4 bg-slate-50 rounded-xl">
                    <button
                      onClick={() => handleViewProduct(item.productHandle)}
                      className="relative w-16 h-16 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      <button onClick={() => handleViewProduct(item.productHandle)} className="text-left w-full">
                        <h4 className="font-semibold text-brand-primary text-sm mb-1 truncate hover:text-brand-red transition-colors">
                          {item.title}
                        </h4>
                      </button>
                      {item.attributes?.find((attr) => attr.key === "household_size") && (
                        <p className="text-xs text-slate-600 mb-1">
                          Household size: {item.attributes.find((attr) => attr.key === "household_size")?.value}
                        </p>
                      )}
                      {item.attributes?.find((attr) => attr.key === "special_requests") && (
                        <p className="text-xs text-slate-600 mb-1 italic">
                          Special requests: {item.attributes.find((attr) => attr.key === "special_requests")?.value}
                        </p>
                      )}
                      {item.price_per_kg && item.variantWeightGrams && (
                        <p className="text-xs text-slate-500 mb-2">
                          {formatWeight(item.variantWeightGrams)} × {formatPricePerKg(item.price_per_kg)}/kg
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 rounded"
                          >
                            <MinusIcon />
                          </button>
                          <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 rounded"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-brand-primary text-sm">{formatPrice(item.lineTotal)}</p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-xs text-brand-red hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upsell Products */}
              {upsellProducts.length > 0 && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-brand-primary mb-4">
                    {remainingForFreeDelivery > 0
                      ? `Add ${formatPrice(remainingForFreeDelivery)} more for free delivery`
                      : "Suggested Items"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {upsellProducts.map((product) => (
                      <div
                        key={product.handle}
                        className="[&_.card]:shadow-none [&_.card]:border [&_.card]:border-slate-200 [&_.card]:hover:shadow-md [&_.card]:hover:border-slate-300"
                      >
                        <ProductCard product={product} showQuickAdd={true} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.itemCount > 0 && (
          <div className="border-t border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg text-brand-primary">Total:</span>
              <span className="font-bold text-xl text-brand-primary">{formatPrice(state.total)}</span>
            </div>

            <div className="space-y-3">
              <Button variant="secondary" className="w-full" onClick={() => dispatch({ type: "CLOSE_CART" })}>
                Continue Shopping
              </Button>
              <div>
                <Button
                  className="w-full bg-brand-red hover:bg-red-700"
                  onClick={handleCheckout}
                  disabled={checkoutBusy}
                  aria-busy={checkoutBusy ? "true" : "false"}
                >
                  {checkoutBusy ? "Preparing…" : "Checkout"}
                </Button>
                {checkoutError && <p className="mt-2 text-xs text-brand-red opacity-75">{checkoutError}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
