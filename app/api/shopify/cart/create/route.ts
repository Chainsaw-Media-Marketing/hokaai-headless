import { NextResponse } from "next/server"
import { ensureCart } from "@/server/shopify"
import { serializeCartCookie } from "@/lib/cookies"
import type { Request } from "next/dist/server/web/types"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    let payload: { cartId?: string } = {}
    try {
      payload = await request.json()
    } catch {
      // Empty body is acceptable
    }

    const cart = await ensureCart(payload.cartId)

    if (!cart?.cartId) {
      return NextResponse.json({ error: "Failed to create cart" }, { status: 500 })
    }

    const res = NextResponse.json({
      cartId: cart.cartId ?? null,
      checkoutUrl: cart.checkoutUrl ?? null,
      hasLines: cart.hasLines ?? false,
      cart: { id: cart.cartId, checkoutUrl: cart.checkoutUrl },
    })

    res.headers.set(
      "Set-Cookie",
      serializeCartCookie({
        id: cart.cartId,
        checkoutUrl: cart.checkoutUrl ?? undefined,
      }),
    )

    return res
  } catch (error) {
    console.error("[cart/create] storefront error", error)
    return NextResponse.json({ error: "Failed to create cart" }, { status: 500 })
  }
}
