"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WavyDivider } from "@/components/wavy-divider"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [mountedAt, setMountedAt] = useState<number>(0)
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  useEffect(() => {
    setMountedAt(Date.now())
  }, [])

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const whatsappNumber = "27633018293"

  const copyToClipboard = (text: string): boolean => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text)
      })
      return true
    } else {
      return fallbackCopy(text)
    }
  }

  const fallbackCopy = (text: string): boolean => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
      textArea.remove()
      return true
    } catch (error) {
      textArea.remove()
      return false
    }
  }

  const handleCopyAndOpen = (type: "email" | "phone", value: string, href: string) => {
    copyToClipboard(value)
    setCopiedItem(type)
    setTimeout(() => setCopiedItem(null), 2000)
    window.location.href = href
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitSuccess(false)

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const name = (formData.get("name") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const subject = (formData.get("subject") as string)?.trim()
    const message = (formData.get("message") as string)?.trim()

    const newErrors: Record<string, string> = {}
    if (!name) newErrors.name = "Name is required"
    if (!email) newErrors.email = "Email is required"
    if (!phone) newErrors.phone = "Phone is required"
    if (!subject) newErrors.subject = "Subject is required"
    if (!message) newErrors.message = "Message is required"

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
          subject,
          message,
          source: "contact",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setSubmitSuccess(true)
      formRef.current?.reset()
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Failed to send message. Please try again." })
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
    const subject = (formData.get("subject") as string)?.trim()
    const message = (formData.get("message") as string)?.trim()

    const fullBody = `[Hokaai] Website Contact

Name: ${name}
Email: ${email}
Phone: ${phone}

Subject: ${subject}
Message:
${message}`

    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(fullBody)}`
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBody)}`, "_blank")
      }, 800)
    } else {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBody)}`, "_blank")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-h1 text-brand-primary mb-6">Contact Us</h1>
              <p className="text-body text-slate-700 leading-relaxed max-w-2xl mx-auto">
                Get in touch with our team for custom orders, catering, or any questions about our premium meat
                products.
              </p>
            </div>
          </div>
        </section>

        <WavyDivider />

        <section className="py-8 lg:py-12 section-alt">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-h2 text-brand-primary mb-8">Visit Our Store</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 text-brand-red mt-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-brand-primary mb-1">Address</h3>
                      <p className="text-body text-slate-700">
                        Hokaai Shopping Centre
                        <br />
                        558 Graaff Reinet St, Faerie Glen
                        <br />
                        Pretoria, 0081
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 text-brand-red mt-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="relative">
                      <h3 className="font-heading font-semibold text-brand-primary mb-1">Phone</h3>
                      <button
                        onClick={() => handleCopyAndOpen("phone", "012 991 2801", "tel:+27129912801")}
                        className="text-body text-slate-700 hover:text-brand-red transition-colors cursor-pointer text-left"
                      >
                        012 991 2801
                      </button>
                      {copiedItem === "phone" && (
                        <span className="absolute -top-8 left-0 bg-brand-success text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                          Copied!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 text-brand-red mt-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="relative">
                      <h3 className="font-heading font-semibold text-brand-primary mb-1">Email</h3>
                      <button
                        onClick={() =>
                          handleCopyAndOpen(
                            "email",
                            "info@hokaaimeatmarket.co.za",
                            "mailto:info@hokaaimeatmarket.co.za",
                          )
                        }
                        className="text-body text-slate-700 hover:text-brand-red transition-colors cursor-pointer text-left break-all"
                      >
                        info@hokaaimeatmarket.co.za
                      </button>
                      {copiedItem === "email" && (
                        <span className="absolute -top-8 left-0 bg-brand-success text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                          Copied!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 text-brand-red mt-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-brand-primary mb-1">Store Hours</h3>
                      <div className="text-body text-slate-700 space-y-1">
                        <p>Monday - Friday: 8:30 AM - 6:00 PM</p>
                        <p>Saturday: 8:00 AM - 4:00 PM</p>
                        <p>Sunday: 9:00 AM - 1:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 text-brand-red mt-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-brand-primary mb-1">Delivery Hours</h3>
                      <div className="text-body text-slate-700 space-y-1">
                        <p>Monday: 9:30 AM - 4:00 PM</p>
                        <p>Tuesday - Friday: 9:00 AM - 4:00 PM</p>
                        <p>Saturday: 9:00 AM - 3:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-h2 text-brand-primary mb-8">Send Us a Message</h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <input
                    ref={honeypotRef}
                    name="contact[company]"
                    tabIndex={-1}
                    autoComplete="off"
                    className="sr-only"
                    aria-hidden="true"
                  />

                  <div>
                    <label htmlFor="name" className="block text-label text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red text-body"
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-label text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red text-body"
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-label text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red text-body"
                    />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-label text-slate-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red text-body"
                    >
                      <option value="">Select a subject</option>
                      <option value="General enquiry">General enquiry</option>
                      <option value="Custom order">Custom order</option>
                      <option value="Catering services">Catering services</option>
                      <option value="Wholesale inquiry">Wholesale inquiry</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                    {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-label text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red text-body"
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
                  </div>

                  {errors.form && (
                    <div className="rounded-lg border border-red-500/30 bg-red-50 p-3 text-red-600 text-sm">
                      {errors.form}
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="rounded-lg border border-green-500/30 bg-green-50 p-3 text-green-600 text-sm">
                      Message sent successfully! We'll get back to you soon.
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleWhatsAppFallback}
                    variant="outline"
                    className="w-full border-brand-red text-brand-red hover:bg-brand-red/5 bg-transparent"
                  >
                    Or Send via WhatsApp
                  </Button>

                  <p className="text-xs text-slate-600 text-center">
                    We'll respond to your inquiry as soon as possible.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
