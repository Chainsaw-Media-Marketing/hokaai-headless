/**
 * Unified cart actions that sync with Shopify Storefront API
 */

import { getCartMeta } from "./cart-meta"

export interface AddLineInput {
  variantId: string
  quantity: number
  attributes?: Array<{ key: string; value: string }>
}

export interface AddToCartInput {
  lines: AddLineInput[]
}

/**
 * Add items to cart and hydrate client state from server
 */
export async function addToCartAndHydrate(input: AddToCartInput): Promise<void> {
  try {
    // 1. Get current cartId from localStorage
    const { cartId: currentCartId } = getCartMeta()

    // 2. POST to /api/shopify/cart/add
    const addResponse = await fetch("/api/shopify/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: currentCartId,
        lines: input.lines,
      }),
    })

    const payload = await addResponse.json()

    if (!addResponse.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[cart] add error:", payload)
      }
      throw new Error(payload?.error || "ADD_FAILED")
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart] add → ok:", payload.lineCount, payload.itemCount)
    }

    if (typeof window !== "undefined" && payload) {
      if (payload.cartId) {
        window.localStorage.setItem("hk_shopify_cart_id", payload.cartId)
      }
      if (payload.checkoutUrl) {
        window.localStorage.setItem("hk_shopify_checkout_url", payload.checkoutUrl)
      }
      window.dispatchEvent(new CustomEvent("cart:hydrate", { detail: payload }))

      // Hard-wired hydrator
      if ((window as any).__HK_CART_HYDRATE__) {
        ;(window as any).__HK_CART_HYDRATE__(payload)
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart] hydrate → itemCount:", payload.itemCount, "lines:", payload.lineCount)
    }

    // 5. Show toast
    showToast(`Added ${input.lines.length} item${input.lines.length > 1 ? "s" : ""} to cart`)
  } catch (error) {
    console.error("[cart-actions] addToCartAndHydrate error:", error)
    showToast("Couldn't add to cart. Please try again.", "error")
    throw error
  }
}

/**
 * Bootstrap cart on app load
 * ALWAYS fetches from server to sync with cart cookie, even if localStorage is empty
 */
export async function bootstrapCartOnLoad(): Promise<void> {
  try {
    const { cartId } = getCartMeta()

    const response = await fetch("/api/shopify/cart/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId: cartId || null }),
    })

    if (!response.ok) {
      console.error("[cart-actions] bootstrapCartOnLoad failed:", response.status)
      return
    }

    const payload = await response.json()

    // Relaxed hydration - accept cart if we have EITHER cartId, checkoutUrl, or items
    const shouldHydrate = payload.cartId || payload.checkoutUrl || (payload.lines && payload.lines.length > 0)

    if (!shouldHydrate) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[cart-actions] No valid cart data to hydrate")
      }
      return
    }

    if (typeof window !== "undefined" && payload) {
      // Save cartId if we have it
      if (payload.cartId) {
        window.localStorage.setItem("hk_shopify_cart_id", payload.cartId)
      }
      // Save checkoutUrl if we have it
      if (payload.checkoutUrl) {
        window.localStorage.setItem("hk_shopify_checkout_url", payload.checkoutUrl)
      }

      // Always dispatch hydrate event if we have valid cart data
      window.dispatchEvent(new CustomEvent("cart:hydrate", { detail: payload }))

      // Hard-wired hydrator
      if ((window as any).__HK_CART_HYDRATE__) {
        ;(window as any).__HK_CART_HYDRATE__(payload)
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("[cart-actions] bootstrapCartOnLoad → synced cart:", {
          cartId: payload.cartId,
          checkoutUrl: payload.checkoutUrl,
          itemCount: payload.itemCount,
          lineCount: payload.lineCount,
          hadLocalStorageId: !!cartId,
        })
      }
    }
  } catch (error) {
    console.error("[cart-actions] bootstrapCartOnLoad error:", error)
  }
}

/**
 * Simple toast notification
 */
function showToast(message: string, type: "success" | "error" = "success"): void {
  if (typeof window === "undefined") return

  // Dispatch custom event for toast
  const event = new CustomEvent("cart:toast", {
    detail: { message, type },
  })
  window.dispatchEvent(event)
}

/**
 * Update cart line quantity and sync with Shopify
 */
export async function updateCartQuantityAndHydrate(lineId: string, quantity: number): Promise<void> {
  try {
    // 1. Get current cartId from localStorage
    const { cartId: currentCartId } = getCartMeta()

    if (!currentCartId) {
      console.error("[cart-actions] No cartId found for update")
      return
    }

    // 2. POST to /api/shopify/cart/update
    const updateResponse = await fetch("/api/shopify/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: currentCartId,
        lines: [{ id: lineId, quantity }],
      }),
    })

    const payload = await updateResponse.json()

    if (!updateResponse.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[cart] update error:", payload)
      }
      throw new Error(payload?.error || "UPDATE_FAILED")
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart] update → ok:", payload.lineCount, payload.itemCount)
    }

    if (typeof window !== "undefined" && payload) {
      if (payload.cartId) {
        window.localStorage.setItem("hk_shopify_cart_id", payload.cartId)
      }
      if (payload.checkoutUrl) {
        window.localStorage.setItem("hk_shopify_checkout_url", payload.checkoutUrl)
      }
      window.dispatchEvent(new CustomEvent("cart:hydrate", { detail: payload }))

      // Hard-wired hydrator
      if ((window as any).__HK_CART_HYDRATE__) {
        ;(window as any).__HK_CART_HYDRATE__(payload)
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart] hydrate after update → itemCount:", payload.itemCount, "lines:", payload.lineCount)
    }
  } catch (error) {
    console.error("[cart-actions] updateCartQuantityAndHydrate error:", error)
    showToast("Couldn't update cart. Please try again.", "error")
    throw error
  }
}

/**
 * Remove cart line and sync with Shopify
 */
export async function removeCartLineAndHydrate(lineId: string): Promise<void> {
  try {
    // 1. Get current cartId from localStorage
    const { cartId: currentCartId } = getCartMeta()

    if (!currentCartId) {
      console.error("[cart-actions] No cartId found for remove")
      return
    }

    // 2. POST to /api/shopify/cart/update
    const updateResponse = await fetch("/api/shopify/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: currentCartId,
        removeLineIds: [lineId],
      }),
    })

    const payload = await updateResponse.json()

    if (!updateResponse.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[cart] remove error:", payload)
      }
      throw new Error(payload?.error || "REMOVE_FAILED")
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart] remove → ok:", payload.lineCount, payload.itemCount)
    }

    if (typeof window !== "undefined" && payload) {
      if (payload.cartId) {
        window.localStorage.setItem("hk_shopify_cart_id", payload.cartId)
      }
      if (payload.checkoutUrl) {
        window.localStorage.setItem("hk_shopify_checkout_url", payload.checkoutUrl)
      }
      window.dispatchEvent(new CustomEvent("cart:hydrate", { detail: payload }))

      // Hard-wired hydrator
      if ((window as any).__HK_CART_HYDRATE__) {
        ;(window as any).__HK_CART_HYDRATE__(payload)
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart] hydrate after remove → itemCount:", payload.itemCount, "lines:", payload.lineCount)
    }

    showToast("Item removed from cart")
  } catch (error) {
    console.error("[cart-actions] removeCartLineAndHydrate error:", error)
    showToast("Couldn't remove item. Please try again.", "error")
    throw error
  }
}

/**
 * Clear cart completely - removes all items from Shopify and syncs with client
 */
export async function clearCartAndHydrate(): Promise<void> {
  try {
    // 1. Get current cartId from localStorage
    const { cartId: currentCartId } = getCartMeta()

    // 2. POST to /api/shopify/cart/clear
    const clearResponse = await fetch("/api/shopify/cart/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: currentCartId || null,
      }),
    })

    const payload = await clearResponse.json()

    if (!clearResponse.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[cart] clear error:", payload)
      }
      throw new Error(payload?.error || "CLEAR_FAILED")
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart] clear → ok, cart now empty")
    }

    // 3. Save updated cart state to localStorage
    if (typeof window !== "undefined" && payload) {
      if (payload.cartId) {
        window.localStorage.setItem("hk_shopify_cart_id", payload.cartId)
      }
      if (payload.checkoutUrl) {
        window.localStorage.setItem("hk_shopify_checkout_url", payload.checkoutUrl)
      }
      window.dispatchEvent(new CustomEvent("cart:hydrate", { detail: payload }))

      // Hard-wired hydrator
      if ((window as any).__HK_CART_HYDRATE__) {
        ;(window as any).__HK_CART_HYDRATE__(payload)
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart] hydrate after clear → itemCount:", payload.itemCount, "lines:", payload.lineCount)
    }

    showToast("Cart cleared")
  } catch (error) {
    console.error("[cart-actions] clearCartAndHydrate error:", error)
    showToast("Couldn't clear cart. Please try again.", "error")
    throw error
  }
}
