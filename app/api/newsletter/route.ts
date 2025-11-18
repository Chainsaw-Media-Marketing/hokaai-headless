import { NextRequest, NextResponse } from "next/server"

const SHOPIFY_STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Basic validation
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
      console.error("[newsletter] Missing SHOPIFY_STORE_DOMAIN env var")
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    // Build the same payload Shopify's contact form expects
    const form = new URLSearchParams()
    form.append("form_type", "customer")
    form.append("contact[email]", email)
    // Optional: tag customer as newsletter
    form.append("contact[tags]", "newsletter")

    const shopifyResponse = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html,application/json,*/*",
      },
      body: form.toString(),
      redirect: "manual", // We don't care about the redirect target, just success/fail
    })

    // Shopify usually responds with 302 on success, or 200/400 with HTML if there are errors.
    if (shopifyResponse.status === 302 || shopifyResponse.ok) {
      console.log("[newsletter] Successfully subscribed:", email)
      return NextResponse.json({ success: true })
    }

    const raw = await shopifyResponse.text()
    console.error(
      "[newsletter] Shopify /contact non-OK",
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

