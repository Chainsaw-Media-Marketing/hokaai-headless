import { NextResponse } from "next/server"

/**
 * GET /api/shopify/account-url
 * Returns the Shopify account URL
 */
export async function GET() {
  try {
    const domain = process.env.SHOPIFY_STOREFRONT_DOMAIN

    if (!domain) {
      console.error("[API] SHOPIFY_STOREFRONT_DOMAIN environment variable is not set")
      return NextResponse.json({ error: "Shopify domain not configured" }, { status: 500 })
    }

    const accountUrl = `https://${domain}/account`

    console.log("[SERVER][v0] Account URL generated:", accountUrl)

    return NextResponse.json({ accountUrl })
  } catch (error) {
    console.error("[API] Account URL error:", error)
    return NextResponse.json({ error: "Failed to get account URL" }, { status: 500 })
  }
}
