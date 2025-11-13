import { NextResponse } from "next/server"
import { addLinesToCart, createCartWithLines } from "@/server/shopify"
import { mapShopifyCartToSummary } from "@/lib/mapShopifyCartToSummary"

function toVariantGID(id: string) {
  return id?.startsWith("gid://") ? id : `gid://shopify/ProductVariant/${id}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}) as any)
    const incomingCartId = body.cartId as string | undefined

    let lines: Array<{
      merchandiseId: string
      quantity: number
      attributes?: { key: string; value: string }[]
    }> = []

    if (Array.isArray(body?.lines)) {
      lines = body.lines.map((l: any) => ({
        merchandiseId: toVariantGID(String(l?.variantId ?? "")),
        quantity: Number.isFinite(l?.quantity) ? Math.max(1, Number(l.quantity)) : 1,
        attributes: Array.isArray(l?.attributes) ? l.attributes : undefined,
      }))
    } else if (body?.variantId) {
      lines = [
        {
          merchandiseId: toVariantGID(String(body.variantId)),
          quantity: Number.isFinite(body?.quantity) ? Math.max(1, Number(body.quantity)) : 1,
          attributes: Array.isArray(body?.attributes) ? body.attributes : undefined,
        },
      ]
    }

    if (!lines.length) {
      return NextResponse.json({ error: "lines is required" }, { status: 400 })
    }

    let finalCart = null

    if (incomingCartId) {
      const added = await addLinesToCart(incomingCartId, lines)
      // Check if we got a valid cart back with lines
      if (added && added.lines && added.lines.edges && added.lines.edges.length > 0) {
        finalCart = added
        if (process.env.NODE_ENV !== "production") {
          console.log("[cart/add] Added to existing cart:", incomingCartId)
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log("[cart/add] Existing cart is stale or empty, will create new cart")
        }
      }
    }

    if (!finalCart) {
      const created = await createCartWithLines(lines)
      finalCart = created
      if (process.env.NODE_ENV !== "production") {
        console.log("[cart/add] Created new cart with lines")
      }
    }

    const payload = mapShopifyCartToSummary(finalCart)

    if (process.env.NODE_ENV !== "production") {
      console.log("[cart/add] Returning payload: itemCount:", payload.itemCount, "lineCount:", payload.lineCount)
    }

    return NextResponse.json(payload, { status: 200 })
  } catch (err) {
    console.error("[cart/add] error", err)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
