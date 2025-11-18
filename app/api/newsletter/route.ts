import { NextRequest, NextResponse } from "next/server"

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

    const shopifyDomain = "https://hokaaimeatmarket.co.za"
    const contactUrl = `${shopifyDomain}/contact`
    
    // Build form-urlencoded body
    const formData = new URLSearchParams({
      "form_type": "customer",
      "contact[email]": email,
      "contact[tags]": "newsletter",
    })

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      // POST to Shopify's native contact endpoint
      const response = await fetch(contactUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check if successful
      const responseText = await response.text()
      
      if (response.ok && responseText.includes("Thank you for your message")) {
        console.log("[newsletter] Successfully subscribed:", email)
        return NextResponse.json({ success: true })
      }

      // If response wasn't OK or didn't include success message
      console.error("[newsletter] Subscription failed:", response.status, responseText)
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 400 }
      )
    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("[newsletter] Request timed out")
        return NextResponse.json(
          { success: false, error: "Request timed out. Please try again." },
          { status: 408 }
        )
      }
      throw fetchError
    }
  } catch (error) {
    console.error("[newsletter] Subscription error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to subscribe. Please try again."
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    )
  }
}
