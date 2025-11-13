/**
 * Centralized localStorage utilities for cart metadata
 */

const CART_ID_KEY = "hk_shopify_cart_id"
const CHECKOUT_URL_KEY = "hk_shopify_checkout_url"

export interface CartMeta {
  cartId: string | null
  checkoutUrl: string | null
}

export function getCartMeta(): CartMeta {
  if (typeof window === "undefined") {
    return { cartId: null, checkoutUrl: null }
  }

  return {
    cartId: localStorage.getItem(CART_ID_KEY),
    checkoutUrl: localStorage.getItem(CHECKOUT_URL_KEY),
  }
}

export function setCartMeta(meta: Partial<CartMeta>): void {
  if (typeof window === "undefined") return

  if (meta.cartId !== undefined) {
    if (meta.cartId) {
      localStorage.setItem(CART_ID_KEY, meta.cartId)
    } else {
      localStorage.removeItem(CART_ID_KEY)
    }
  }

  if (meta.checkoutUrl !== undefined) {
    if (meta.checkoutUrl) {
      localStorage.setItem(CHECKOUT_URL_KEY, meta.checkoutUrl)
    } else {
      localStorage.removeItem(CHECKOUT_URL_KEY)
    }
  }
}

export function clearCartMeta(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CART_ID_KEY)
  localStorage.removeItem(CHECKOUT_URL_KEY)
}
