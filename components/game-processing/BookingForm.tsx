"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"

interface BookingFormProps {
  whatsappNumber: string
}

export function BookingForm({ whatsappNumber }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mountedAt, setMountedAt] = useState<number>(0)
  const [showFallback, setShowFallback] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lastMessage, setLastMessage] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMountedAt(Date.now())
  }, [])

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    // Get form data
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const name = (formData.get("name") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const species = (formData.get("species") as string)?.trim()
    const weight = (formData.get("weight") as string)?.trim()
    const notes = (formData.get("notes") as string)?.trim()

    // Validate required fields
    const newErrors: Record<string, string> = {}
    if (!name) newErrors.name = "Name is required"
    if (!email) newErrors.email = "Email is required"
    if (!phone) newErrors.phone = "Phone is required"

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

    const fullBody = `[Hokaai] Game Processing Booking

Name: ${name}
Email: ${email}
Phone: ${phone}

Species / Type of game: ${species || ""}
Estimated weight (kg): ${weight || ""}
Processing requests / notes:
${notes || "None"}

Page: /game-processing
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
        Book Your Game for Processing
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-brand-red" />
      </h2>
      <p className="text-foreground/70 mb-6 text-center">
        Have a question or want to book your game for processing? Complete the form below and we'll contact you to
        arrange everything.
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

          <div>
            <label htmlFor="species" className="block text-sm font-medium text-white mb-1">
              Species / Type of game
            </label>
            <input
              type="text"
              id="species"
              name="species"
              placeholder="e.g., Impala, Kudu, Springbok"
              className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-white mb-1">
              Estimated weight (kg)
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              placeholder="e.g., 50"
              className="w-full rounded-lg border border-border/40 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">
              Processing requests / notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Tell us how you'd like your game processed (biltong, droëwors, steaks, etc.)"
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
            We'll reply on WhatsApp to arrange collection and processing.
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
