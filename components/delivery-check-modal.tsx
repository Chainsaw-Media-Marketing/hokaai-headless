"use client"

import type React from "react"
import { useState } from "react"
import { X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeliveryCheckModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
}

const VALID_POSTAL_CODES = [
  "0002",
  "0022",
  "0042",
  "0043",
  "0059",
  "0060",
  "0076",
  "0081",
  "0083",
  "0084",
  "0101",
  "0149",
  "0154",
  "0157",
  "0169",
  "0181",
  "0182",
  "0184",
  "0186",
  "1692",
]

type Panel = "input" | "success" | "courier"

export function DeliveryCheckModal({ isOpen, onClose, onVerified }: DeliveryCheckModalProps) {
  const [postalCode, setPostalCode] = useState("")
  const [panel, setPanel] = useState<Panel>("input")
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const markVerified = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hk_postal_verified", "true")
    }
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = postalCode.trim()

    if (!/^\d{4}$/.test(trimmed)) {
      setError("Please enter a valid 4-digit postal code.")
      return
    }

    setError(null)

    if (VALID_POSTAL_CODES.includes(trimmed)) {
      setPanel("success")
    } else {
      setPanel("courier")
    }
  }

  const handleClose = () => {
    markVerified()
    onClose()
  }

  const handleContinue = () => {
    markVerified()
    onVerified()
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full mx-4 relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close delivery check"
        >
          <X className="h-6 w-6" />
        </button>

        {panel === "input" && (
          <>
            <MapPin className="h-12 w-12 mx-auto mb-4 text-brand-red" />
            <h3 className="text-h3 font-heading font-semibold text-brand-primary mb-4">Check Your Delivery Area</h3>
            <p className="text-body text-slate-700 mb-6">
              Enter your postal code to see your delivery options before adding items to your cart.
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter your postal code"
                className="w-full px-4 py-3 border border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-success focus:border-transparent"
                maxLength={4}
                required
              />
              <Button type="submit" size="lg" className="w-full">
                Verify Area
              </Button>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </form>
          </>
        )}

        {panel === "success" && (
          <>
            <h3 className="text-h3 font-heading font-semibold text-brand-primary mb-4">
              {"🎉 You're in the Local Zone!"}
            </h3>
            <p className="text-body text-slate-700 mb-6">
              Perfect! You qualify for our localized delivery service (Flat rate of R50, or FREE on orders over R1 500).
            </p>
            <Button size="lg" className="w-full" onClick={handleContinue}>
              Continue to Cart
            </Button>
          </>
        )}

        {panel === "courier" && (
          <>
            <h3 className="text-h3 font-heading font-semibold text-brand-primary mb-4">
              {"🚚 Nationwide Courier Covered!"}
            </h3>
            <p className="text-body text-slate-700 mb-6">
              You are outside our internal local delivery zone, but we&apos;ve got you covered. Your order will be
              shipped fresh nationwide via express courier at a fixed flat rate of R200.
            </p>
            <Button size="lg" className="w-full" onClick={handleContinue}>
              Continue to Cart
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
