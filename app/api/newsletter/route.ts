import { NextRequest, NextResponse } from "next/server"
import { storefrontFetch } from "@/server/shopify"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    const mutation = `
      mutation customerCreate($input: CustomerInput!) {
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
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
        },
        tags: ["newsletter"],
      },
    }

    const data = await storefrontFetch<{
      customerCreate: {
        customer: {
          id: string
          email: string
        } | null
        customerUserErrors: Array<{ field: string[]; message: string }>
      }
    }>(mutation, variables)

    // Check for errors
    if (data.customerCreate.customerUserErrors && data.customerCreate.customerUserErrors.length > 0) {
      const error = data.customerCreate.customerUserErrors[0]
      console.error("[newsletter] Customer create error:", error)
      
      // If customer already exists, that's actually a success case for newsletter
      if (error.message.toLowerCase().includes("taken") || error.message.toLowerCase().includes("already")) {
        console.log("[newsletter] Customer already exists, treating as success")
        return NextResponse.json({ success: true })
      }
      
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    console.log("[newsletter] Successfully subscribed:", email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[newsletter] Subscription error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to subscribe. Please try again."
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    )
  }
}
