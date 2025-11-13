"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"

interface SpitHireFormProps {
  whatsappNumber: string
}

export function SpitHireForm({ whatsappNumber }: SpitHireFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mountedAt, setMountedAt] = useState<number>(0)
  const [showFallback, setShowFallback] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lastMessage, setLastMessage] = useState("")
  const [guestCount, setGuestCount] = useState(50)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMountedAt(Date.now())
  }, [])

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  const handleExtraToggle = (extra: string) => {
    setSelectedExtras((prev) => (prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    // Get form data
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const name = (formData.get("name") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const eventDate = (formData.get("eventDate") as string)?.trim()
    const eventTime = (formData.get("eventTime") as string)?.trim()
    const address = (formData.get("address") as string)?.trim()
    const suburb = (formData.get("suburb") as string)?.trim()
    const city = (formData.get("city") as string)?.trim()
    const postalCode = (formData.get("postalCode") as string)?.trim()
    const unitType = (formData.get("unitType") as string)?.trim()
    const buyingMeat = (formData.get("buyingMeat") as string)?.trim()
    const notes = (formData.get("notes") as string)?.trim()

    // Validate required fields
    const newErrors: Record<string, string> = {}
    if (!name) newErrors.name = "Name is required"
    if (!email) newErrors.email = "Email is required"
    if (!phone) newErrors.phone = "Phone is required"
    if (!unitType) newErrors.unitType = "Please select a spit type"
    if (!buyingMeat) newErrors.buyingMeat = "Please indicate if you need meat"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Check honeypot - block if filled
    if (honeypotRef.current && honeypotRef.current.value) {
      setErrors({ form: "Invalid submission detected" })
      return
    }

    // Time trap: block if submitted < 3s after mount
    const timeSinceMount = Date.now() - mountedAt
    if (timeSinceMount < 3000) {
      setErrors({ form: "Please wait a moment before submitting" })
      return
    }

    const fullBody = `[Hokaai] Spitbraai Hire Booking

Name: ${name}
Email: ${email}
Phone: ${phone}

Event Date: ${eventDate || "Not specified"}
Event Time: ${eventTime || "Not specified"}
Number of Guests: ${guestCount}

Event Address:
${address || "Not specified"}
Suburb: ${suburb || "Not specified"}
City: ${city || "Not specified"}
Postal Code: ${postalCode || "Not specified"}

Spit Type: ${unitType}
Buying Meat: ${buyingMeat}

Extras Needed: ${selectedExtras.length > 0 ? selectedExtras.join(", ") : "None"}

Additional Notes:
${notes || "None"}

Page: /spitbraai-hire
Timestamp: ${new Date().toISOString()}`

    setLastMessage(fullBody)
    setIsSubmitting(true)

    if (isMobile) {
      // Try native app first
      window.location.href = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(fullBody)}`
      // After 800ms, open fallback tab
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBody)}`, "_blank")
      }, 800)
    } else {
      // Desktop: open WhatsApp Web
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBody)}`, "_blank")
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setShowFallback(true)
      formRef.current?.reset()
      setSelectedExtras([])
      setGuestCount(50)
    }, 1000)
  }

  const handleCopy = () => {
    if (lastMessage) {
      navigator.clipboard.writeText(lastMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <section className="mb-12 w-full max-w-2xl">
      <h2 className="text-2xl md:text-3xl font-semibold text-black mb-2 relative group text-center">
        Book Your Spitbraai
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-brand-red" />
      </h2>
      <p className="text-foreground/70 mb-6 text-center">
        Ready to hire a spitbraai? Complete the form below and we'll contact you via WhatsApp to confirm your booking.
      </p>

      <div className="rounded-2xl border border-border/40 bg-black p-6 max-w-2xl">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field */}
          <input
            ref={honeypotRef}
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="sr-only"
            aria-hidden="true"
          />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-white mb-1">
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label htmlFor="eventTime" className="block text-sm font-medium text-white mb-1">
                Event Time
              </label>
              <input
                type="time"
                id="eventTime"
                name="eventTime"
                className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          </div>

          <div>
            <label htmlFor="guestCount" className="block text-sm font-medium text-white mb-1">
              Number of Guests: {guestCount}
            </label>
            <input
              type="range"
              id="guestCount"
              name="guestCount"
              min="0"
              max="200"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-red"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>0</span>
              <span>200</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Event Location</h3>
            <div>
              <label htmlFor="address" className="block text-xs text-white/70 mb-1">
                Street Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="e.g., 123 Main Street"
                className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="suburb" className="block text-xs text-white/70 mb-1">
                  Suburb
                </label>
                <input
                  type="text"
                  id="suburb"
                  name="suburb"
                  placeholder="e.g., Menlyn"
                  className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-xs text-white/70 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="e.g., Pretoria"
                  className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-xs text-white/70 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                placeholder="e.g., 0181"
                className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          </div>

          <div>
            <label htmlFor="unitType" className="block text-sm font-medium text-white mb-1">
              Spit Type *
            </label>
            <select
              id="unitType"
              name="unitType"
              required
              className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">Select a spit type</option>
              <option value="Big Spit (80-100 people)">Big Spit (80-100 people) - R850 / R1,000</option>
              <option value="Mini Spit (30-40 people)">Mini Spit (30-40 people) - R550 / R750</option>
            </select>
            {errors.unitType && <p className="text-xs text-red-400 mt-1">{errors.unitType}</p>}
          </div>

          <div>
            <label htmlFor="buyingMeat" className="block text-sm font-medium text-white mb-1">
              Will you be buying meat from us? *
            </label>
            <select
              id="buyingMeat"
              name="buyingMeat"
              required
              className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">Please select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.buyingMeat && <p className="text-xs text-red-400 mt-1">{errors.buyingMeat}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Additional Services & Extras</label>
            <div className="grid grid-cols-2 gap-2">
              {["Catering", "Salads", "Breads", "Delivery", "Vegetables", "Desserts"].map((extra) => (
                <label
                  key={extra}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedExtras.includes(extra)}
                    onChange={() => handleExtraToggle(extra)}
                    className="w-4 h-4 rounded border-border/40 text-brand-red focus:ring-2 focus:ring-brand-red accent-brand-red"
                  />
                  <span className="text-white text-sm">{extra}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Any special requests, specific requirements for extras, or questions?"
              className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red resize-none"
            />
          </div>

          {errors.form && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-400 text-sm">
              {errors.form}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold"
          >
            {isSubmitting ? "Opening WhatsApp..." : "Send via WhatsApp"}
          </Button>

          <p className="text-xs text-white/60 text-center">
            We'll reply on WhatsApp to confirm your booking and arrange collection.
          </p>
        </form>

        {showFallback && (
          <div className="mt-6 pt-6 border-t border-border/40">
            <p className="text-xs text-white/70 mb-3 text-center">If WhatsApp didn't open, use one of these options:</p>
            <div className="flex flex-col sm:flex-row gap-2">
              {isMobile && (
                <a
                  href="tel:+27633018293"
                  className="flex-1 rounded-lg border border-border/40 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors text-center"
                >
                  Call us
                </a>
              )}
              {isMobile && (
                <a
                  href={`sms:+27633018293?&body=${encodeURIComponent(lastMessage)}`}
                  className="flex-1 rounded-lg border border-border/40 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors text-center"
                >
                  Send SMS instead
                </a>
              )}
              <button
                onClick={handleCopy}
                className="flex-1 rounded-lg border border-border/40 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors relative"
              >
                {copied ? "Copied!" : "Copy message"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
