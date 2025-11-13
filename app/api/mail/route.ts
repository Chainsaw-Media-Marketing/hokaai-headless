import { Resend } from "resend"
import type { NextRequest } from "next/server"

/**
 * POST /api/mail
 *
 * Sends email via Resend using environment variables:
 * - RESEND_API_KEY: Resend API key
 * - MAIL_FROM: Sender email address
 * - CONTACT_RECIPIENT: Recipient email address
 *
 * Expected JSON body:
 * {
 *   form: string,                  // e.g., "Game Processing Booking"
 *   name: string,
 *   email: string,
 *   phone?: string,
 *   message?: string,              // optional freeform
 *   extras?: Record<string, any>   // optional key/values to include
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { form, name, email, phone, message, extras } = body

    // Validate required fields
    if (!form || !name || !email) {
      return Response.json({ ok: false, error: "Missing required fields: form, name, email" }, { status: 400 })
    }

    // Check if email transport is configured
    const { RESEND_API_KEY, MAIL_FROM, CONTACT_RECIPIENT } = process.env
    if (!RESEND_API_KEY || !MAIL_FROM || !CONTACT_RECIPIENT) {
      return Response.json({ ok: false, error: "Email transport not configured" }, { status: 503 })
    }

    // Compose email subject and body
    const subject = `[Hokaai] ${form}`

    const extrasText = extras
      ? Object.entries(extras)
          .map(([k, v]) => `${k}: ${v ?? ""}`)
          .join("\n")
      : ""

    const bodyText = `
Form: ${form}
Name: ${name}
Email: ${email}
Phone: ${phone || ""}
${extrasText}
Message:
${message || "—"}

Timestamp: ${new Date().toISOString()}
    `.trim()

    // Send email via Resend
    const resend = new Resend(RESEND_API_KEY)
    await resend.emails.send({
      from: MAIL_FROM,
      to: CONTACT_RECIPIENT,
      subject,
      text: bodyText,
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error("[v0] Email API error:", error)
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
