import { NextRequest, NextResponse } from "next/server"

const SHOPIFY_DOMAIN =
  process.env.SHOPIFY_STOREFRONT_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const SHOPIFY_ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2025-01"

type AdminCustomerCreateResponse = {
  data?: {
    customerCreate?: {
      customer: {
        id: string
        email: string
      } | null
      userErrors: Array<{
        field: string[] | null
        message: string
      }>
    }
  }
  errors?: Array<{ message: string }>
}

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

    if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_API_TOKEN) {
      console.error("[newsletter] Missing Shopify admin env vars")
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    const endpoint = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`

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
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify({ query: mutation, variables }),
    })

    const json = (await res.json()) as AdminCustomerCreateResponse

    if (json.errors && json.errors.length > 0) {
      console.error("[newsletter] Admin GraphQL top-level errors:", json.errors)
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    const payload = json.data?.customerCreate
    if (!payload) {
      console.error("[newsletter] No customerCreate payload:", json)
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    const userErrors = payload.userErrors || []
    if (userErrors.length > 0) {
      const first = userErrors[0]
      const msg = first.message.toLowerCase()
      console.error("[newsletter] customerCreate user error:", first)

      // If the email is already used, treat it as success for newsletter purposes
      if (
        msg.includes("already") ||
        msg.includes("taken") ||
        msg.includes("has already been used")
      ) {
        console.log("[newsletter] Customer already exists, treating as success:", email)
        return NextResponse.json({ success: true })
      }

      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 400 },
      )
    }

    console.log("[newsletter] Successfully subscribed via Admin API:", email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[newsletter] Subscription error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again." },
      { status: 500 },
    )
  }
}
