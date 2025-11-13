import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getCartById, ensureCart } from "@/server/shopify"
import { parseCartCookie, serializeCartCookie } from "@/lib/cookies"
import { mapShopifyCartToSummary } from "@/lib/mapShopifyCartToSummary"

export const dynamic = "force-dynamic"

async function handler(req?: Request) {
  let bodyCartId: string | null = null
  if (req) {
    const body = await req.json().catch(() => ({}))
    bodyCartId = body?.cartId || null
  }

  const cookieStore = await cookies()
  const parsed = parseCartCookie(cookieStore.get("hk_shopify_cart")?.value ?? null)

  const cartIdToFetch = bodyCartId || parsed?.id

  let cart
  if (cartIdToFetch) {
    cart = await getCartById(cartIdToFetch).catch(() => null)
  }

  if (!cart) {
    const created = await ensureCart()
    if (!created?.cartId) {
      return NextResponse.json({ error: "Failed to bootstrap cart" }, { status: 500 })
    }

    const setCookie = serializeCartCookie({
      id: created.cartId,
      checkoutUrl: created.checkoutUrl ?? undefined,
    })

    const createdCart = await getCartById(created.cartId)
    const payload = mapShopifyCartToSummary(createdCart)

    const res = NextResponse.json(payload)
    res.headers.set("Set-Cookie", setCookie)
    return res
  }

  const payload = mapShopifyCartToSummary(cart)

  if (!payload.cartId && cartIdToFetch) {
    payload.cartId = cartIdToFetch
  }

  if (!payload.checkoutUrl && parsed?.checkoutUrl) {
    payload.checkoutUrl = parsed.checkoutUrl
  }

  return NextResponse.json(payload)
}

export async function POST(req: Request) {
  return handler(req)
}
export async function GET() {
  return handler()
}
