"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { CartItem, Product } from "./types"
import { bootstrapCartOnLoad } from "./cart-actions"

interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
  lineCount: number
  subtotalAmount: number
  currencyCode: string
  cartId?: string | null
  checkoutUrl?: string | null
}

type CartAction =
  | {
      type: "ADD_ITEM"
      payload: {
        product: Product
        weight: number
        quantity: number
        variantPrice?: number
        variantId?: string
        attributes?: Array<{ key: string; value: string }>
      }
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "UPDATE_WEIGHT"; payload: { id: string; weight: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SYNC_CART_META"; payload: { cartId?: string | null; checkoutUrl?: string | null } }
  | {
      type: "HYDRATE_FROM_SERVER"
      payload: {
        cartId: string
        checkoutUrl: string
        lineCount: number
        itemCount: number
        subtotalAmount: number
        currencyCode: string
        lines: Array<{
          id: string
          title: string
          variantId: string
          quantity: number
          unitPrice: number
          lineAmount: number
          imageUrl?: string
          productHandle: string
          attributes?: Array<{ key: string; value: string }>
          weight?: number
          weightUnit?: string
        }>
      }
    }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, weight, quantity, variantPrice, variantId, attributes } = action.payload

      // Mode A: If price_per_kg exists, use it
      // Mode B: Otherwise use variant price
      const usePricePerKg = product.price_per_kg && product.price_per_kg > 0
      const lineTotal = usePricePerKg
        ? product.price_per_kg * weight * quantity // Mode A: price/kg × weight × qty
        : (variantPrice || product.pricePerKg) * quantity // Mode B: variant price × qty

      const existingItemIndex = state.items.findIndex((item) => item.productId === product.id && item.weight === weight)

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        // Update existing item
        const existingItem = state.items[existingItemIndex]
        const newQuantity = existingItem.quantity + quantity
        const newLineTotal = usePricePerKg
          ? (product.price_per_kg || 0) * existingItem.weight * newQuantity
          : (existingItem.variantPrice || existingItem.pricePerKg) * newQuantity

        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: newQuantity,
                lineTotal: newLineTotal,
              }
            : item,
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${weight}`,
          productId: product.id,
          productHandle: product.handle, // Store handle for navigation
          title: product.title,
          image: product.image,
          pricePerKg: product.pricePerKg,
          weight,
          quantity,
          lineTotal,
          variantWeightGrams: weight * 1000, // Convert kg to grams for display
          price_per_kg: product.price_per_kg,
          variantPrice, // Store variant price for fixed-price items
          variantId, // Store Shopify variant ID
          attributes,
        }
        newItems = [...state.items, newItem]
      }

      const total = newItems.reduce((sum, item) => sum + item.lineTotal, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
        isOpen: true,
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.lineTotal, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: id })
      }

      const newItems = state.items.map((item) => {
        if (item.id === id) {
          const usePricePerKg = item.price_per_kg && item.price_per_kg > 0
          const newLineTotal = usePricePerKg
            ? item.price_per_kg * item.weight * quantity
            : (item.variantPrice || item.pricePerKg) * quantity

          return {
            ...item,
            quantity,
            lineTotal: newLineTotal,
          }
        }
        return item
      })

      const total = newItems.reduce((sum, item) => sum + item.lineTotal, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      }
    }

    case "UPDATE_WEIGHT": {
      const { id, weight } = action.payload
      const newItems = state.items.map((item) => {
        if (item.id === id) {
          const usePricePerKg = item.price_per_kg && item.price_per_kg > 0
          const newLineTotal = usePricePerKg
            ? item.price_per_kg * weight * item.quantity
            : (item.variantPrice || item.pricePerKg) * item.quantity

          return {
            ...item,
            weight,
            lineTotal: newLineTotal,
          }
        }
        return item
      })

      const total = newItems.reduce((sum, item) => sum + item.lineTotal, 0)

      return {
        ...state,
        items: newItems,
        total,
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      }

    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      }

    case "SYNC_CART_META":
      return {
        ...state,
        cartId: action.payload.cartId ?? state.cartId,
        checkoutUrl: action.payload.checkoutUrl ?? state.checkoutUrl,
      }

    case "HYDRATE_FROM_SERVER": {
      const p = action.payload ?? {}
      const linesRaw = Array.isArray(p.lines) ? p.lines : []

      const items: CartItem[] = linesRaw.map((line: any) => ({
        id: line.id || "",
        productId: line.variantId || "",
        productHandle: line.productHandle || "",
        title: line.title || "",
        image: line.imageUrl || null,
        pricePerKg: (line.unitPrice || 0) / 100, // Convert cents to currency
        weight: line.weight || 1,
        quantity: Number(line.quantity || 0),
        lineTotal: (line.lineAmount || 0) / 100, // Convert cents to currency
        variantWeightGrams: line.weight && line.weightUnit === "GRAMS" ? line.weight : undefined,
        variantPrice: (line.unitPrice || 0) / 100,
        variantId: line.variantId || "",
        attributes: Array.isArray(line.attributes) ? line.attributes : undefined,
      }))

      const itemCount = items.reduce((a, it) => a + (Number(it.quantity) || 0), 0)
      const lineCount = items.length
      const subtotalAmount = Number(p.subtotalAmount || 0)

      const next: CartState = {
        ...state,
        cartId: p.cartId ?? null,
        checkoutUrl: p.checkoutUrl ?? null,
        currencyCode: p.currencyCode || "ZAR",
        subtotalAmount,
        total: subtotalAmount / 100, // Convert cents to currency
        itemCount,
        lineCount,
        items,
        isOpen: items.length > 0 ? true : state.isOpen,
      }

      if (typeof window !== "undefined") {
        try {
          ;(window as any).__cartState = next
          const el = document.querySelector("[data-diag]")
          if (el) {
            el.setAttribute("data-diag", `itemCount:${next.itemCount} lineCount:${next.lineCount}`)
          }
          if (process.env.NODE_ENV !== "production") {
            console.log("[cart] hydrate → itemCount:", next.itemCount, "lines:", next.lineCount)
          }
        } catch {}
      }

      return next
    }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  lineCount: 0,
  subtotalAmount: 0,
  currencyCode: "ZAR",
  cartId: null,
  checkoutUrl: null,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    bootstrapCartOnLoad()
  }, [])

  useEffect(() => {
    // Listen for cart:hydrate events from client actions
    const handleHydrate = (event: Event) => {
      const ce = event as CustomEvent
      if (!ce.detail) return
      // Forward ENTIRE payload to the reducer
      dispatch({
        type: "HYDRATE_FROM_SERVER",
        payload: ce.detail,
      })
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cart:hydrate", handleHydrate as EventListener)
    }

    // On mount, try to restore from localStorage
    const savedCartId = typeof window !== "undefined" ? window.localStorage.getItem("hk_shopify_cart_id") : null

    if (savedCartId) {
      ;(async () => {
        try {
          const res = await fetch("/api/shopify/cart/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartId: savedCartId }),
          })
          if (res.ok) {
            const payload = await res.json()
            if (payload && Array.isArray(payload.lines) && payload.lines.length > 0) {
              dispatch({ type: "HYDRATE_FROM_SERVER", payload })
            }
          }
        } catch (err) {
          console.warn("[cart] restore failed", err)
        }
      })()
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:hydrate", handleHydrate as EventListener)
      }
    }
  }, [dispatch])

  useEffect(() => {
    if (typeof window === "undefined") return
    ;(window as any).__HK_CART_HYDRATE__ = (payload: any) => {
      if (!payload) return
      dispatch({
        type: "HYDRATE_FROM_SERVER",
        payload,
      })
    }

    return () => {
      if ((window as any).__HK_CART_HYDRATE__) {
        delete (window as any).__HK_CART_HYDRATE__
      }
    }
  }, [dispatch])

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type } = event.detail
      // You can integrate with your toast system here
      console.log(`[Toast ${type}]:`, message)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cart:toast", handleToast as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:toast", handleToast as EventListener)
      }
    }
  }, [])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function useCartActions() {
  return {
    addToCartAndHydrate: (input: Parameters<typeof import("./cart-actions").addToCartAndHydrate>[0]) =>
      import("./cart-actions").then((m) => m.addToCartAndHydrate(input)),
  }
}
