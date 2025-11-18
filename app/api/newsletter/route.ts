import { NextRequest, NextResponse } from "next/server"

const SHOPIFY_STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

export async function POST(request: NextRequest) {
  try {
    // Detect how the client sent the data: JSON vs form
    const contentType = request.headers.get("content-type") || ""
    let email: string | null = null

    if (contentType.includes("application/json")) {
      // JSON payload: { email: "..." }
      const body = await request.json().catch((err) => {
        console.error("[newsletter] Failed to parse JSON body:", err)
        return null
      })

      if (body && typeof body.email === "string") {
        email = body.email
      }
    } else {
      // Fallback for form submissions (e.g. <form method="POST">)
      const formData = await request.formData().catch((err) => {
        console.error("[newsletter] Failed to parse formData:", err)
        return null
      })

      if (formData) {
        email =
          (formData.get("email") as string | null) ||
          (formData.get("contact[email]") as string | null) ||
          null
      }
    }

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

    // Build the payload Shopify's /contact expects
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
      redirect: "manual", // we only care if it succeeded, not where it redirects
    })

    // Shopify usually returns 302 on success, 200/4xx with HTML on errors
    if (shopifyResponse.status === 302 || shopifyResponse.ok) {
      console.log("[newsletter] Successfully subscribed:", email)
      return NextResponse.json({ success: true })
    }

    const raw = await shopifyResponse.text().catch(() => "")
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
