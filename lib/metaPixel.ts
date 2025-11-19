// Helper function to track Meta Pixel events safely
// Does not throw on server and handles missing fbq gracefully
export function trackMetaPixelEvent(event: string, data?: Record<string, any>) {
  if (typeof window === "undefined") return
  const w = window as any
  if (typeof w.fbq !== "function") {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[meta-pixel] fbq not available, event not sent:", event, data)
    }
    return
  }
  if (data) {
    w.fbq("track", event, data)
  } else {
    w.fbq("track", event)
  }
}

// TODO: Purchase event - requires /order/success page or webhook listener
// to capture order data from Shopify after checkout completes
