"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { WHATSAPP_E164, WHATSAPP_BUSINESS_HOURS, formatWhatsAppNumber } from "@/lib/site-contact"

interface WhatsAppChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export function WhatsAppChatPanel({ isOpen, onClose }: WhatsAppChatPanelProps) {
  const [message, setMessage] = useState("")
  const [showFallback, setShowFallback] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize message with current page URL
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const defaultMessage = `Hi Hokaai! I'm on ${window.location.href} and have a question.`
      setMessage(defaultMessage)

      // Focus textarea when panel opens
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle ESC key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when panel is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return

    const panel = panelRef.current
    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    panel.addEventListener("keydown", handleTab)
    return () => panel.removeEventListener("keydown", handleTab)
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const url = `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`

    try {
      const newWindow = window.open(url, "_blank", "noopener,noreferrer")

      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        // Popup blocked, show fallback
        setShowFallback(true)
        copyToClipboard()
      } else {
        // Success, close panel
        onClose()
      }
    } catch (error) {
      // Error opening window, show fallback
      setShowFallback(true)
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    const textToCopy = `Number: ${formatWhatsAppNumber(WHATSAPP_E164)}\nMessage: ${message}`
    navigator.clipboard.writeText(textToCopy).catch(() => {
      // Clipboard API failed, user will see the fallback text
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-panel-title"
        className="fixed bottom-6 right-6 w-full max-w-sm bg-white dark:bg-[#1A1A1A] rounded-lg shadow-2xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WhatsAppIcon className="h-6 w-6" />
            <div>
              <h2 id="whatsapp-panel-title" className="font-semibold text-lg">
                Chat with Hokaai
              </h2>
              <p className="text-xs text-white/90">We reply {WHATSAPP_BUSINESS_HOURS}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close chat panel"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!showFallback ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="whatsapp-message"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Your message
                </label>
                <textarea
                  ref={textareaRef}
                  id="whatsapp-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#25D366] dark:bg-[#141414] dark:text-white resize-none"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
              >
                Continue on WhatsApp
              </button>

              <div className="text-center">
                <a
                  href={`tel:${formatWhatsAppNumber(WHATSAPP_E164).replace(/\s/g, "")}`}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors"
                >
                  Or call: {formatWhatsAppNumber(WHATSAPP_E164)}
                </a>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                We'll use this to reply on WhatsApp. No data is stored here.
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Unable to open WhatsApp automatically. Here's your information:
              </p>
              <div className="bg-slate-100 dark:bg-[#141414] p-3 rounded-md">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Number: {formatWhatsAppNumber(WHATSAPP_E164)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Message: {message}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Copied to clipboard! Open WhatsApp and paste.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
