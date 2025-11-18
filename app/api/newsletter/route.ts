import { NextRequest, NextResponse } from "next/server"

const SHOPIFY_STORE_DOMAIN =
  process.env.SHOPIFY_STOREFRONT_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN

const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const SHOPIFY_ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2025-01"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // --- Basic validation ---
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

    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_TOKEN) {
      console.error("[newsletter] Missing SHOPIFY_STOREFRONT_DOMAIN or SHOPIFY_ADMIN_API_TOKEN")
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    // --- Admin API mutation: create/update customer with email marketing consent ---
    const mutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const now = new Date().toISOString()

    const variables = {
      input: {
        email,
        tags: ["newsletter"],
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
          consentUpdatedAt: now,
        },
      },
    }

    const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify({ query: mutation, variables }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("[newsletter] Shopify Admin API HTTP error:", res.status, text.slice(0, 300))
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    const json = (await res.json()) as {
      data?: {
        customerCreate?: {
          customer: { id: string; email: string } | null
          userErrors: { field: string[] | null; message: string }[]
        }
      }
      errors?: { message: string }[]
    }

    if (json.errors && json.errors.length > 0) {
      console.error("[newsletter] Top-level GraphQL errors:", json.errors)
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    const result = json.data?.customerCreate
    if (!result) {
      console.error("[newsletter] Missing customerCreate in response:", json)
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    // If Shopify returns userErrors, handle the common "already taken" case as success
    if (result.userErrors && result.userErrors.length > 0) {
      const firstError = result.userErrors[0]
      console.warn("[newsletter] customerCreate userErrors:", result.userErrors)

      const msg = firstError.message.toLowerCase()
      if (msg.includes("taken") || msg.includes("already")) {
        console.log("[newsletter] Customer already exists, treating as subscribed:", email)
        return NextResponse.json({ success: true })
      }

      return NextResponse.json(
        { success: false, error: firstError.message || "Failed to subscribe." },
        { status: 400 },
      )
    }

    console.log("[newsletter] Successfully subscribed:", email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[newsletter] Subscription error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again." },
      { status: 500 },
    )
  }
}
