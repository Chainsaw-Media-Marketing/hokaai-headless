import { NextRequest, NextResponse } from "next/server"
import { storefrontFetch } from "@/server/shopify"

type CustomerCreateResponse = {
  customerCreate: {
    customer: {
      id: string
      email: string
      emailMarketingConsent?: {
        marketingState: string
      } | null
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

    // 🔑 Storefront API mutation with the **correct** input type
    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            emailMarketingConsent {
              marketingState
            }
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
        // Storefront API supports email marketing consent
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
        },
        // ⚠️ Storefront API does NOT support tags, so we skip tags here
        // tags: ["newsletter"],   // <— this would be Admin API-only
      },
    }

    const data = await storefrontFetch<CustomerCreateResponse>(mutation, variables)

    const errors = data.customerCreate.customerUserErrors || []

    if (errors.length > 0) {
      const first = errors[0]
      console.error("[newsletter] customerCreate error:", first)

      const msg = first.message.toLowerCase()

      // If the email is already in use, we treat that as success for newsletter purposes
      if (msg.includes("already") || msg.includes("taken") || msg.includes("has already been used")) {
        console.log("[newsletter] Customer already exists, treating as success:", email)
        return NextResponse.json({ success: true })
      }

      // Otherwise, surface a generic error to the user
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
