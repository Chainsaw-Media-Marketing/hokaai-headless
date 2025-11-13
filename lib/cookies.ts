export const CART_COOKIE = "hk_shopify_cart"

export function parseCartCookie(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return null
  const m = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(CART_COOKIE + "="))
  if (!m) return null
  try {
    const raw = decodeURIComponent(m.split("=").slice(1).join("="))
    return JSON.parse(raw) as { id: string; key?: string; checkoutUrl?: string }
  } catch {
    return null
  }
}

export function serializeCartCookie(
  value: { id: string; key?: string; checkoutUrl?: string },
  opts?: { maxAge?: number },
) {
  const body = encodeURIComponent(JSON.stringify(value))
  const parts = [
    `${CART_COOKIE}=${body}`,
    "Path=/",
    "SameSite=Lax",
    "Secure",
    `Max-Age=${opts?.maxAge ?? 60 * 60 * 24 * 30}`, // 30 days
  ]
  return parts.join("; ")
}
