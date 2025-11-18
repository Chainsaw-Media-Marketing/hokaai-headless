import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    const {
      name,
      email,
      phone,
      message,
      source,
      // Optional fields
      subject: bodySubject, // Renamed to avoid conflict with computed subject variable
      species,
      weight,
      notes,
      eventDate,
      eventTime,
      guestCount,
      address,
      suburb,
      city,
      postalCode,
      unitType,
      buyingMeat,
      extras,
    } = body

    // Validate required fields
    if (!name || !email || !message || !source) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, email, message, and source are required" },
        { status: 400 }
      )
    }

    // Check env vars
    const fromEmail = process.env.CONTACT_FROM_EMAIL
    const toEmail = process.env.CONTACT_TARGET_EMAIL

    if (!fromEmail || !toEmail) {
      console.error("[v0] Missing email configuration: CONTACT_FROM_EMAIL or CONTACT_TARGET_EMAIL not set")
      return NextResponse.json(
        { success: false, error: "Email configuration error. Please contact us directly." },
        { status: 500 }
      )
    }

    // Format source for subject line
    const sourceLabel =
      source === "contact-us"
        ? "Contact Us"
        : source === "game-processing"
        ? "Game Processing Enquiry"
        : source === "spitbraai-hire"
        ? "Spitbraai Hire Enquiry"
        : source === "whatsapp-fallback"
        ? "WhatsApp Fallback"
        : "Website Contact"

    const subject = `[Hokaai Contact] ${sourceLabel} - ${name}`

    // Build email body HTML
    let htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">${sourceLabel}</h2>
        <p style="color: #64748b; font-size: 14px;">Submitted: ${new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:+${phone.replace(/\D/g, "")}">${phone}</a></p>
    `

    // Add subject if present (Contact Us page)
    if (bodySubject) { // Using renamed variable
      htmlBody += `<p><strong>Subject:</strong> ${bodySubject}</p>`
    }

    htmlBody += `</div>`

    // Add game processing specific fields
    if (source === "game-processing") {
      htmlBody += `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Game Details</h3>
          ${species ? `<p><strong>Species:</strong> ${species}</p>` : ""}
          ${weight ? `<p><strong>Estimated Weight:</strong> ${weight} kg</p>` : ""}
          ${notes ? `<p><strong>Processing Requests:</strong><br/>${notes.replace(/\n/g, "<br/>")}</p>` : ""}
        </div>
      `
    }

    // Add spitbraai hire specific fields
    if (source === "spitbraai-hire") {
      htmlBody += `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Event Details</h3>
          ${eventDate ? `<p><strong>Event Date:</strong> ${eventDate}</p>` : ""}
          ${eventTime ? `<p><strong>Event Time:</strong> ${eventTime}</p>` : ""}
          ${guestCount ? `<p><strong>Number of Guests:</strong> ${guestCount}</p>` : ""}
          ${unitType ? `<p><strong>Spit Type:</strong> ${unitType}</p>` : ""}
          ${buyingMeat ? `<p><strong>Buying Meat:</strong> ${buyingMeat}</p>` : ""}
          ${extras && extras.length > 0 ? `<p><strong>Extras:</strong> ${extras.join(", ")}</p>` : ""}
        </div>
      `

      if (address || suburb || city || postalCode) {
        htmlBody += `
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Location</h3>
            ${address ? `<p>${address}</p>` : ""}
            ${suburb ? `<p>${suburb}</p>` : ""}
            ${city ? `<p>${city}</p>` : ""}
            ${postalCode ? `<p>${postalCode}</p>` : ""}
          </div>
        `
      }

      if (notes) {
        htmlBody += `
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Additional Notes</h3>
            <p>${notes.replace(/\n/g, "<br/>")}</p>
          </div>
        `
      }
    }

    // Add message for all sources
    htmlBody += `
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Message</h3>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
        <p>This message was sent from the Hokaai Meat Market website (${source})</p>
      </div>
    </div>
    `

    // Build plain text version
    let textBody = `${sourceLabel}\n\nSubmitted: ${new Date().toISOString()}\n\n`
    textBody += `CONTACT INFORMATION\n`
    textBody += `Name: ${name}\n`
    textBody += `Email: ${email}\n`
    textBody += `Phone: ${phone}\n`
    
    if (bodySubject) { // Using renamed variable
      textBody += `Subject: ${bodySubject}\n`
    }

    if (source === "game-processing") {
      textBody += `\nGAME DETAILS\n`
      if (species) textBody += `Species: ${species}\n`
      if (weight) textBody += `Estimated Weight: ${weight} kg\n`
      if (notes) textBody += `Processing Requests: ${notes}\n`
    }

    if (source === "spitbraai-hire") {
      textBody += `\nEVENT DETAILS\n`
      if (eventDate) textBody += `Event Date: ${eventDate}\n`
      if (eventTime) textBody += `Event Time: ${eventTime}\n`
      if (guestCount) textBody += `Number of Guests: ${guestCount}\n`
      if (unitType) textBody += `Spit Type: ${unitType}\n`
      if (buyingMeat) textBody += `Buying Meat: ${buyingMeat}\n`
      if (extras && extras.length > 0) textBody += `Extras: ${extras.join(", ")}\n`

      if (address || suburb || city || postalCode) {
        textBody += `\nEVENT LOCATION\n`
        if (address) textBody += `${address}\n`
        if (suburb) textBody += `${suburb}\n`
        if (city) textBody += `${city}\n`
        if (postalCode) textBody += `${postalCode}\n`
      }

      if (notes) textBody += `\nAdditional Notes: ${notes}\n`
    }

    textBody += `\nMESSAGE\n${message}\n`
    textBody += `\n---\nSent from: ${source}\n`

    // Send email via Resend
    const data = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html: htmlBody,
      text: textBody,
    })

    console.log("[v0] Contact email sent successfully:", data)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error sending contact email:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send email. Please try again or contact us directly." },
      { status: 500 }
    )
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
