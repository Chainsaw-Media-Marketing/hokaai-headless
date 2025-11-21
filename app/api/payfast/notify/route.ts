import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let payload: any = {}

    // Handle form-urlencoded data (PayFast default)
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text()
      const params = new URLSearchParams(text)
      params.forEach((value, key) => {
        payload[key] = value
      })
    } else {
      // Handle JSON data (fallback)
      payload = await request.json()
    }

    console.log("[payfast-notify] payload", payload)
  } catch (error) {
    console.error("[payfast-notify] error parsing notify payload", error)
  }

  // Always respond 200 OK so the gateway treats it as received
  return NextResponse.json({ status: "ok" }, { status: 200 })
}
