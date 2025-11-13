/**
 * Client-side Shopify cart utilities
 * Provides safe front-end functions that interact with API routes only
 */

const CART_ID_KEY = "hk_shopify_cart_id"
const CHECKOUT_URL_KEY = "hk_shopify_checkout_url"

interface CartState {
  cartId: string | null
  checkoutUrl: string | null
}

/**
 * Normalize checkout URL from API response
 * Handles both checkoutUrl (Storefront API) and webUrl (legacy) fields
 */
function normalizeCheckoutUrl(obj?: any): string | null {
  return obj?.checkoutUrl || obj?.webUrl || null
}

/**
 * Get cart state from localStorage
 */
function getCartState(): CartState {
  if (typeof window === "undefined") {
    return { cartId: null, checkoutUrl: null }
  }

  return {
    cartId: localStorage.getItem(CART_ID_KEY),
    checkoutUrl: localStorage.getItem(CHECKOUT_URL_KEY),
  }
}

/**
 * Save cart state to localStorage
 */
function saveCartState(cartId: string, checkoutUrl: string): void {
  if (typeof window === "undefined") return

  localStorage.setItem(CART_ID_KEY, cartId)
  localStorage.setItem(CHECKOUT_URL_KEY, checkoutUrl)
}

/**
 * Clear cart state from localStorage
 */
function clearCartState(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(CART_ID_KEY)
  localStorage.removeItem(CHECKOUT_URL_KEY)
}

/**
 * Bootstrap cart state from localStorage
 * Call this on app initialization to restore cart
 *
 * NOTE: This function should rarely be called directly.
 * The main cart hydration is handled by CartProvider + bootstrapCartOnLoad() in lib/cart-actions.ts
 * This function only validates an existing cartId, it does NOT fetch from server cookie.
 */
export async function bootstrapCart(): Promise<CartState> {
  const state = getCartState()

  // If we have a cart ID, verify it's still valid
  if (state.cartId) {
    try {
      const response = await fetch("/api/shopify/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: state.cartId }),
      })

      if (response.ok) {
        const data = await response.json()
        const checkoutUrl = normalizeCheckoutUrl(data?.cart || data)

        if (data?.cart?.id || data?.cartId) {
          // Cart exists - save it even if checkoutUrl might be missing or cart has empty lines
          const finalCartId = data?.cart?.id || data?.cartId
          const finalCheckoutUrl = checkoutUrl || state.checkoutUrl || ""
          if (finalCheckoutUrl) {
            saveCartState(finalCartId, finalCheckoutUrl)
          }
          return { cartId: finalCartId, checkoutUrl: finalCheckoutUrl }
        } else {
          // No cart object in response - truly invalid
          console.log("[Shopify Client] No cart in response, clearing state")
          clearCartState()
          return { cartId: null, checkoutUrl: null }
        }
      } else {
        if (response.status === 404) {
          console.log("[Shopify Client] Cart not found (404), clearing state")
          clearCartState()
          return { cartId: null, checkoutUrl: null }
        } else {
          console.log("[Shopify Client] Cart fetch failed with", response.status, "preserving state")
          return state
        }
      }
    } catch (error) {
      console.error("[Shopify Client] Error bootstrapping cart:", error)
      console.log("[Shopify Client] Network error, preserving cart state for retry")
      return state
    }
  }

  return state
}

/**
 * Add item to cart
 * Creates cart if needed
 */
export async function addToCartClient(
  variantId: string,
  quantity = 1,
  attributes?: Array<{ key: string; value: string }>,
): Promise<boolean> {
  try {
    const state = getCartState()

    const requestBody: {
      cartId: string | null
      variantId: string
      quantity: number
      attributes?: Array<{ key: string; value: string }>
    } = {
      cartId: state.cartId,
      variantId,
      quantity,
    }

    // Only include attributes if they exist and are non-empty
    if (attributes && attributes.length > 0) {
      requestBody.attributes = attributes
    }

    const response = await fetch("/api/shopify/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to add item to cart")
    }

    const data = await response.json()
    const checkoutUrl = normalizeCheckoutUrl(data)
    if (data.cartId && checkoutUrl) {
      saveCartState(data.cartId, checkoutUrl)
    }

    return true
  } catch (error) {
    console.error("[Shopify Client] Error adding to cart:", error)
    alert("Failed to add item to cart. Please try again.")
    return false
  }
}

/**
 * Go to Shopify checkout
 * Redirects to stored checkoutUrl
 */
export function goToCheckout(checkoutUrl: string | null | undefined): void {
  if (!checkoutUrl) return
  const target = typeof window !== "undefined" && window.top ? window.top : window
  // same-tab, top-level navigation
  target.location.href = checkoutUrl
}

/**
 * Go to Shopify account page
 * Fetches the account URL from the API
 */
export async function goToAccount(): Promise<void> {
  try {
    const response = await fetch("/api/shopify/account-url")

    if (!response.ok) {
      throw new Error("Failed to get account URL")
    }

    const data = await response.json()

    if (!data.accountUrl) {
      throw new Error("No account URL returned")
    }

    // Redirect to Shopify account page in same tab
    window.location.href = data.accountUrl
  } catch (error) {
    console.error("[Shopify Client] Error getting account URL:", error)
    alert("Failed to access account page. Please try again.")
  }
}

/**
 * Get current cart ID
 */
export function getCartId(): string | null {
  return getCartState().cartId
}

/**
 * Get current checkout URL
 */
export function getCheckoutUrl(): string | null {
  return getCartState().checkoutUrl
}

/**
 * Refresh and get the latest checkout URL from the API
 * Updates localStorage if checkoutUrl is present
 */
export async function refreshAndGetCheckoutUrl(): Promise<string> {
  const storedId = typeof window !== "undefined" ? localStorage.getItem(CART_ID_KEY) || undefined : undefined

  const res = await fetch("/api/shopify/cart/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId: storedId }),
    credentials: "include",
  })

  if (!res.ok) {
    const created = await fetch("/api/shopify/cart/create", { method: "POST", credentials: "include" })
    if (!created.ok) throw new Error("Failed to create cart")
    const d = await created.json()
    const url = d?.checkoutUrl || d?.cart?.checkoutUrl
    if (!url) throw new Error("No checkoutUrl after create")
    if (d?.cartId || d?.cart?.id) {
      localStorage.setItem(CART_ID_KEY, d?.cartId || d?.cart?.id)
    }
    if (url) {
      localStorage.setItem(CHECKOUT_URL_KEY, url)
    }
    return url
  }

  const data = await res.json().catch(() => ({}))
  let checkoutUrl = data?.checkoutUrl || data?.cart?.checkoutUrl || null

  if (!checkoutUrl) {
    const created = await fetch("/api/shopify/cart/create", { method: "POST", credentials: "include" })
    if (!created.ok) throw new Error("Failed to create cart (fallback)")
    const d = await created.json()
    checkoutUrl = d?.checkoutUrl || d?.cart?.checkoutUrl || null
    if (d?.cartId || d?.cart?.id) {
      localStorage.setItem(CART_ID_KEY, d?.cartId || d?.cart?.id)
    }
  }

  if (!checkoutUrl) throw new Error("No checkoutUrl present")

  try {
    if (data?.cartId) {
      localStorage.setItem(CART_ID_KEY, data.cartId)
    }
    localStorage.setItem(CHECKOUT_URL_KEY, checkoutUrl)
  } catch {}

  return checkoutUrl
}

/**
 * Add a variant to cart via Shopify Storefront API
 * Persists cartId and checkoutUrl to localStorage
 */
export async function addVariantToCart(opts: {
  variantId: string
  quantity?: number
  attributes?: Array<{ key: string; value: string }>
}) {
  const { variantId, quantity = 1, attributes } = opts

  const cartId = typeof window !== "undefined" ? localStorage.getItem(CART_ID_KEY) || undefined : undefined

  const res = await fetch("/api/shopify/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, variantId, quantity, attributes }),
  })

  if (!res.ok) {
    const t = await res.text().catch(() => "")
    throw new Error(`[addVariantToCart] ${res.status}: ${t || "Add failed"}`)
  }

  const data = await res.json()

  if (data?.cartId) localStorage.setItem(CART_ID_KEY, data.cartId)
  if (data?.checkoutUrl) localStorage.setItem(CHECKOUT_URL_KEY, data.checkoutUrl)

  try {
    // Optional hook if present in app
    // @ts-ignore
    window.__HK_SYNC_CART_META?.({ cartId: data.cartId, checkoutUrl: data.checkoutUrl })
  } catch {}

  return data
}
