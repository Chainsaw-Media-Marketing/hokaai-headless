"use client"

import { useEffect } from "react"
import { initShopifyAutoWire } from "@/lib/shopifyAutoWire"

/**
 * Client component that initializes Shopify auto-wiring
 * This runs only on the client side after hydration
 */
export function ShopifyAutoWireInit() {
  useEffect(() => {
    initShopifyAutoWire()
  }, [])

  return null
}
