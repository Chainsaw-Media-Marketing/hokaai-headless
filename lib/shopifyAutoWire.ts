/**
 * Auto-wiring system for Shopify checkout integration
 * Automatically binds to elements with specific data attributes
 */

import { addToCartAndHydrate } from "./cart-actions"
import { goToCheckout, goToAccount } from "./shopifyClient"

let isInitialized = false

/**
 * Initialize auto-wiring
 * Binds event listeners to elements with Shopify data attributes
 */
export function initShopifyAutoWire(): void {
  // Only run on client side
  if (typeof window === "undefined") return

  // Only initialize once
  if (isInitialized) return
  isInitialized = true

  console.log("[Shopify AutoWire] Initializing...")

  // Bind add to cart buttons
  bindAddToCartButtons()

  // Bind checkout buttons
  bindCheckoutButtons()

  // Bind account buttons
  bindAccountButtons()

  // Re-bind on dynamic content changes (optional, for SPAs)
  observeDOMChanges()

  console.log("[Shopify AutoWire] Initialized successfully")
}

/**
 * Bind add to cart buttons
 * Elements with [data-shopify-add] and [data-variant-id]
 */
function bindAddToCartButtons(): void {
  const buttons = document.querySelectorAll("[data-shopify-add]")

  buttons.forEach((button) => {
    const variantId = button.getAttribute("data-variant-id")
    const quantity = button.getAttribute("data-qty") || "1"

    if (!variantId) {
      console.warn("[Shopify AutoWire] Add button missing data-variant-id:", button)
      return
    }

    // Remove existing listener if any
    const existingListener = (button as any).__shopifyAddListener
    if (existingListener) {
      button.removeEventListener("click", existingListener)
    }

    const listener = async (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      const btn = button as HTMLElement
      const originalText = btn.textContent
      btn.textContent = "Adding..."
      btn.setAttribute("disabled", "true")

      try {
        await addToCartAndHydrate({
          lines: [{ variantId, quantity: Number.parseInt(quantity, 10) }],
        })

        btn.textContent = "Added!"
        setTimeout(() => {
          btn.textContent = originalText
        }, 1500)
      } catch (error) {
        console.error("[Shopify AutoWire] Add failed:", error)
        btn.textContent = "Failed"
        setTimeout(() => {
          btn.textContent = originalText
        }, 1500)
      } finally {
        btn.removeAttribute("disabled")
      }
    }

    // Store listener reference for cleanup
    ;(button as any).__shopifyAddListener = listener

    button.addEventListener("click", listener)
  })

  console.log(`[Shopify AutoWire] Bound ${buttons.length} add-to-cart buttons`)
}

/**
 * Bind checkout buttons
 * Elements with [data-shopify-checkout]
 */
function bindCheckoutButtons(): void {
  const buttons = document.querySelectorAll("[data-shopify-checkout]")

  buttons.forEach((button) => {
    // Remove existing listener if any
    const existingListener = (button as any).__shopifyCheckoutListener
    if (existingListener) {
      button.removeEventListener("click", existingListener)
    }

    // Create new listener
    const listener = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      goToCheckout()
    }

    // Store listener reference for cleanup
    ;(button as any).__shopifyCheckoutListener = listener

    button.addEventListener("click", listener)
  })

  console.log(`[Shopify AutoWire] Bound ${buttons.length} checkout buttons`)
}

/**
 * Bind account buttons
 * Elements with [data-shopify-account]
 */
function bindAccountButtons(): void {
  const buttons = document.querySelectorAll("[data-shopify-account]")

  buttons.forEach((button) => {
    // Remove existing listener if any
    const existingListener = (button as any).__shopifyAccountListener
    if (existingListener) {
      button.removeEventListener("click", existingListener)
    }

    const listener = async (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      await goToAccount()
    }

    // Store listener reference for cleanup
    ;(button as any).__shopifyAccountListener = listener

    button.addEventListener("click", listener)
  })

  console.log(`[Shopify AutoWire] Bound ${buttons.length} account buttons`)
}

/**
 * Observe DOM changes and re-bind buttons
 * Useful for dynamically loaded content
 */
function observeDOMChanges(): void {
  const observer = new MutationObserver((mutations) => {
    let shouldRebind = false

    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Check if any added nodes contain Shopify data attributes
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            if (
              element.querySelector("[data-shopify-add], [data-shopify-checkout], [data-shopify-account]") ||
              element.matches("[data-shopify-add], [data-shopify-checkout], [data-shopify-account]")
            ) {
              shouldRebind = true
              break
            }
          }
        }
      }
      if (shouldRebind) break
    }

    if (shouldRebind) {
      console.log("[Shopify AutoWire] DOM changed, re-binding buttons...")
      bindAddToCartButtons()
      bindCheckoutButtons()
      bindAccountButtons()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

/**
 * Manual re-bind function
 * Call this after dynamically adding Shopify elements
 */
export function rebindShopifyButtons(): void {
  bindAddToCartButtons()
  bindCheckoutButtons()
  bindAccountButtons()
}
