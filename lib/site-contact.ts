// WhatsApp contact configuration
export const WHATSAPP_E164 = "27633018293" // E.164 format, no leading '+'
export const WHATSAPP_BUSINESS_HOURS = "Mon–Sat 08:00–17:00"

// Format E.164 number for display (e.g., "082 555 5622")
export function formatWhatsAppNumber(e164: string): string {
  // Remove country code (27) and format as local SA number
  const local = e164.replace(/^27/, "0")
  return local.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
}
