"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

export function NewsletterInline() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // Handle newsletter signup
      console.log("Newsletter signup:", email)
      setIsSubmitted(true)
      setEmail("")
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-brand-success text-white rounded-2xl p-8 text-center">
        <Mail className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-h3 font-heading font-semibold mb-2">Thank You!</h3>
        <p className="text-lg">You've been successfully subscribed to our newsletter.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-8 text-center">
      <Mail className="h-12 w-12 mx-auto mb-4 text-brand-red" />
      <h3 className="text-h3 font-heading font-semibold text-brand-primary mb-4">Stay in the Loop</h3>
      <p className="text-body text-slate-700 mb-6 max-w-2xl mx-auto">
        Get the latest news, recipes, and special offers delivered straight to your inbox. Be the first to know about
        new products and exclusive deals.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 border border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-success focus:border-transparent"
            required
          />
          <Button type="submit" size="lg" className="px-8">
            Subscribe
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          By subscribing, you agree to our privacy policy and consent to receive marketing emails.
        </p>
      </form>
    </div>
  )
}
