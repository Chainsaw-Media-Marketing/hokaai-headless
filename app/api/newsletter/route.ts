import { NextRequest, NextResponse } from "next/server"

const SHOPIFY_STORE_DOMAIN =
  process.env.SHOPIFY_STOREFRONT_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 },
      )
    }

    if (!SHOPIFY_STORE_DOMAIN) {
      console.error("[newsletter] Missing SHOPIFY_STOREFRONT_DOMAIN env var")
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    const form = new URLSearchParams()
    form.append("form_type", "customer")
    form.append("contact[email]", email)
    form.append("contact[tags]", "newsletter")

    const shopifyResponse = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html,application/json,*/*",
      },
      body: form.toString(),
      redirect: "manual",
    })

    // Shopify returns 302 on success normally
    if (shopifyResponse.status === 302 || shopifyResponse.ok) {
      return NextResponse.json({ success: true })
    }

    const raw = await shopifyResponse.text()
    console.error(
      "[newsletter] Shopify /contact error:",
      shopifyResponse.status,
      raw.slice(0, 300),
    )

    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again." },
      { status: 400 },
    )
  } catch (error) {
    console.error("[newsletter] Subscription error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again." },
      { status: 500 },
    )
  }
}
