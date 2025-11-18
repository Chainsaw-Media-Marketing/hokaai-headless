import { NextRequest, NextResponse } from "next/server"
import { storefrontFetch } from "@/server/shopify"

type CustomerCreateResponse = {
  customerCreate: {
    customer: {
      id: string
      email: string
    } | null
    customerUserErrors: Array<{
      field: string[] | null
      message: string
    }>
  }
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

    // ✅ Minimal Storefront API mutation
    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `

    const variables = {
      input: {
        email,
        // ❌ Do NOT include emailMarketingConsent or tags here – Storefront schema is stricter
      },
    }

    const data = await storefrontFetch<CustomerCreateResponse>(mutation, variables)

    if (!data || !data.customerCreate) {
      console.error("[newsletter] No data.customerCreate in response", data)
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 },
      )
    }

    const { customerUserErrors } = data.customerCreate
    const errors = customerUserErrors || []

    if (errors.length > 0) {
      const first = errors[0]
      console.error("[newsletter] customerCreate error:", first)

      const msg = first.message.toLowerCase()

      // If the email is already used, treat as success for newsletter purposes
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

    console.log("[newsletter] Successfully subscribed via Storefront:", email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[newsletter] Subscription error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again." },
      { status: 500 },
    )
  }
}
