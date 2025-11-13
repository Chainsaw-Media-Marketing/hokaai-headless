import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { getCartById, removeCartLines } from "@/server/shopify"
import { parseCartCookie, serializeCartCookie } from "@/lib/cookies"
import { mapShopifyCartToSummary } from "@/lib/mapShopifyCartToSummary"

export const dynamic = "force-dynamic"

/**
 * Clear all items from cart
 * Fetches current cart, removes all line items, returns empty cart
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const bodyCartId = body?.cartId || null

    const cookieStore = await cookies()
    const parsed = parseCartCookie(cookieStore.get("hk_shopify_cart")?.value ?? null)
    const cartId = bodyCartId || parsed?.id

    if (!cartId) {
      return NextResponse.json({ error: "No cart found to clear" }, { status: 400 })
    }

    const currentCart = await getCartById(cartId)

    if (!currentCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const lineIds = currentCart.lines?.edges?.map((edge: any) => edge.node.id) || []

    if (lineIds.length > 0) {
      const clearedCart = await removeCartLines(cartId, lineIds)

      const payload = mapShopifyCartToSummary(clearedCart)

      if (process.env.NODE_ENV !== "production") {
        console.log("[cart/clear] cleared", lineIds.length, "items → itemCount:", payload.itemCount)
      }

      const setCookie = serializeCartCookie({
        id: cartId,
        checkoutUrl: clearedCart.checkoutUrl || undefined,
      })

      const res = NextResponse.json(payload)
      res.headers.set("Set-Cookie", setCookie)
      return res
    } else {
      const payload = mapShopifyCartToSummary(currentCart)

      if (process.env.NODE_ENV !== "production") {
        console.log("[cart/clear] cart already empty")
      }

      return NextResponse.json(payload)
    }
  } catch (error) {
    console.error("[cart/clear] error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to clear cart" },
      { status: 500 },
    )
  }
}
