"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

interface NewsletterPopupProps {
  onSignupComplete: () => void
  onClose: () => void
}

export function NewsletterPopup({ onSignupComplete, onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // Handle newsletter signup
      console.log("Newsletter signup:", email)
      setIsSubmitted(true)
      setEmail("")

      // Mark as signed up in localStorage
      localStorage.setItem("newsletter-signed-up", "true")

      // Close popup after 2 seconds
      setTimeout(() => {
        onSignupComplete()
      }, 2000)
    }
  }

  const handleClose = () => {
    // Mark that user has seen the popup but didn't sign up
    localStorage.setItem("newsletter-popup-seen", "true")
    onClose()
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full mx-4 relative shadow-2xl">
          <div className="bg-brand-success text-white rounded-2xl p-6">
            <Mail className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-h3 font-heading font-semibold mb-2">Thank You!</h3>
            <p className="text-lg">You've been successfully subscribed to our newsletter.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full mx-4 relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <Mail className="h-12 w-12 mx-auto mb-4 text-brand-red" />
        <h3 className="text-h3 font-heading font-semibold text-brand-primary mb-4">Stay in the Loop</h3>
        <p className="text-body text-slate-700 mb-6">
          Get the latest news, recipes, and special offers delivered straight to your inbox. Be the first to know about
          new products and exclusive deals.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-success focus:border-transparent"
            required
          />
          <Button type="submit" size="lg" className="w-full">
            Subscribe
          </Button>
          <p className="text-xs text-slate-500">
            By subscribing, you agree to our privacy policy and consent to receive marketing emails.
          </p>
        </form>
      </div>
    </div>
  )
}

export function NewsletterFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-brand-red hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-40"
      aria-label="Subscribe to newsletter"
    >
      <Mail className="h-6 w-6" />
    </button>
  )
}

export function NewsletterManager() {
  const [showPopup, setShowPopup] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    // Check if user has already signed up or seen the popup
    const hasSignedUp = localStorage.getItem("newsletter-signed-up") === "true"
    const hasSeenPopup = localStorage.getItem("newsletter-popup-seen") === "true"

    if (!hasSignedUp) {
      if (!hasSeenPopup) {
        // Show popup after 3 seconds
        const timer = setTimeout(() => {
          setShowPopup(true)
        }, 3000)

        return () => clearTimeout(timer)
      } else {
        // User has seen popup but didn't sign up, show floating button
        setShowFloatingButton(true)
      }
    }
  }, [])

  const handleSignupComplete = () => {
    setShowPopup(false)
    setShowFloatingButton(false)
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    setShowFloatingButton(true)
  }

  const handleFloatingButtonClick = () => {
    setShowFloatingButton(false)
    setShowPopup(true)
  }

  return (
    <>
      {showPopup && <NewsletterPopup onSignupComplete={handleSignupComplete} onClose={handlePopupClose} />}
      {showFloatingButton && <NewsletterFloatingButton onClick={handleFloatingButtonClick} />}
    </>
  )
}
