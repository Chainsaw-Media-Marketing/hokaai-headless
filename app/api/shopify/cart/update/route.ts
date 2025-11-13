import { type NextRequest, NextResponse } from "next/server"
import { updateCartLines, removeCartLines } from "@/server/shopify"
import { mapShopifyCartToSummary } from "@/lib/mapShopifyCartToSummary"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId, lines, removeLineIds } = body

    if (!cartId) {
      return NextResponse.json({ error: "Missing cartId" }, { status: 400 })
    }

    let cart

    // Handle line removal
    if (removeLineIds && Array.isArray(removeLineIds) && removeLineIds.length > 0) {
      cart = await removeCartLines(cartId, removeLineIds)
    }
    // Handle line quantity updates
    else if (lines && Array.isArray(lines) && lines.length > 0) {
      cart = await updateCartLines(cartId, lines)
    } else {
      return NextResponse.json({ error: "Missing lines or removeLineIds" }, { status: 400 })
    }

    if (!cart) {
      return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
    }

    // Map to summary format
    const payload = mapShopifyCartToSummary(cart)

    return NextResponse.json(payload)
  } catch (error: any) {
    console.error("[API] /cart/update error:", error)
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 })
  }
}
