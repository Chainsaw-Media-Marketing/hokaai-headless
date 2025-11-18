"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"

interface BookingFormProps {
  whatsappNumber: string
}

export function BookingForm({ whatsappNumber }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [mountedAt, setMountedAt] = useState<number>(0)
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMountedAt(Date.now())
  }, [])

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSubmitSuccess(false)

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const name = (formData.get("name") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const species = (formData.get("species") as string)?.trim()
    const weight = (formData.get("weight") as string)?.trim()
    const notes = (formData.get("notes") as string)?.trim()

    const newErrors: Record<string, string> = {}
    if (!name) newErrors.name = "Name is required"
    if (!email) newErrors.email = "Email is required"
    if (!phone) newErrors.phone = "Phone is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (honeypotRef.current && honeypotRef.current.value) {
      setErrors({ form: "Invalid submission detected" })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: `Game Processing Booking

Species / Type of game: ${species || "Not specified"}
Estimated weight (kg): ${weight || "Not specified"}
Processing requests / notes: ${notes || "None"}`,
          source: "game-processing",
          species,
          weight,
          processingNotes: notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send booking request")
      }

      setSubmitSuccess(true)
      formRef.current?.reset()
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Failed to send booking. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppFallback = () => {
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const name = (formData.get("name") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const species = (formData.get("species") as string)?.trim()
    const weight = (formData.get("weight") as string)?.trim()
    const notes = (formData.get("notes") as string)?.trim()

    const fullBody = `[Hokaai] Game Processing Booking

Name: ${name}
Email: ${email}
Phone: ${phone}

Species / Type of game: ${species || ""}
Estimated weight (kg): ${weight || ""}
Processing requests / notes:
${notes || "None"}`

    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(fullBody)}`
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBody)}`, "_blank")
      }, 800)
    } else {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBody)}`, "_blank")
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

          {submitSuccess && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-green-400 text-sm">
              Booking request sent successfully! We'll contact you soon.
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold"
          >
            {isSubmitting ? "Sending..." : "Send Booking Request"}
          </Button>

          <Button
            type="button"
            onClick={handleWhatsAppFallback}
            variant="outline"
            className="w-full border-white/40 text-white hover:bg-white/10"
          >
            Or Send via WhatsApp
          </Button>

          <p className="text-xs text-white/60 text-center">
            We'll contact you to arrange collection and processing.
          </p>
        </form>
      </div>
    </section>
  )
}
