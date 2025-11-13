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
  const [mountedAt, setMountedAt] = useState<number>(0)
  const [showFallback, setShowFallback] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [lastMessage, setLastMessage] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMountedAt(Date.now())
  }, [])

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const whatsappNumber = "27633018293"
  const publicEmail = "faerieglen@hokaaimeatmarket.co.za"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

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

    const fullBody = `[Hokaai] Website Contact

Name: ${name}
Email: ${email}
Phone: ${phone}

Subject: ${subject}
Message:
${message}

Page: /contact
Timestamp: ${new Date().toISOString()}`

    setLastMessage(fullBody)
    setIsSubmitting(true)

    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(fullBody)}`
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBody)}`, "_blank")
      }, 800)
    } else {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBody)}`, "_blank")
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setShowFallback(true)
      formRef.current?.reset()
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCopyMessage = () => {
    if (lastMessage) {
      navigator.clipboard.writeText(lastMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(publicEmail)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 1500)
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
                    <div>
                      <h3 className="font-heading font-semibold text-brand-primary mb-1">Phone</h3>
                      <p className="text-body text-slate-700">012 991 2801</p>
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
                    <div>
                      <h3 className="font-heading font-semibold text-brand-primary mb-1">Email</h3>
                      <p className="text-body text-slate-700">faerieglen@hokaaimeatmarket.co.za</p>
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
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
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

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold"
                  >
                    {isSubmitting ? "Opening WhatsApp..." : "Send via WhatsApp"}
                  </Button>

                  <p className="text-xs text-slate-600 text-center">
                    We'll reply on WhatsApp to assist you with your inquiry.
                  </p>
                </form>

                {showFallback && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-600 mb-3 text-center">
                      If WhatsApp didn't open, use one of these options:
                    </p>
                    <div className="flex flex-col gap-2">
                      {isMobile ? (
                        <>
                          <a
                            href={`tel:+${whatsappNumber}`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-center"
                          >
                            Call us
                          </a>
                          <a
                            href={`sms:+${whatsappNumber}?&body=${encodeURIComponent(lastMessage)}`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-center"
                          >
                            Send SMS instead
                          </a>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleCopyEmail}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            {copiedEmail ? "Copied!" : "Copy email address"}
                          </button>
                          <button
                            onClick={handleCopyMessage}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            {copied ? "Copied!" : "Copy message"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
