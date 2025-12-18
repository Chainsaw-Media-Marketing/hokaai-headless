"use client"

import { useState, useEffect } from "react"
import { WhatsAppFab } from "./whatsapp-fab"
import { WhatsAppChatPanel } from "./whatsapp-chat-panel"

const ChevronUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
)

interface FloatingActionStackProps {
  showNewsletter?: boolean
  onNewsletterClick?: () => void
}

export function FloatingActionStack({ showNewsletter = false, onNewsletterClick }: FloatingActionStackProps) {
  const [isWhatsAppPanelOpen, setIsWhatsAppPanelOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <div className="lg:hidden fixed bottom-4 right-4 flex flex-col-reverse items-end gap-3 z-50 pb-[calc(env(safe-area-inset-bottom)+0px)]">
        {/* WhatsApp always at bottom */}
        <WhatsAppFab onClick={() => setIsWhatsAppPanelOpen(true)} />

        {/* Newsletter in middle when visible */}
        {showNewsletter && onNewsletterClick && (
          <button
            onClick={onNewsletterClick}
            className="w-12 h-12 bg-brand-red hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
            aria-label="Subscribe to newsletter"
          >
            <Mail className="h-6 w-6" />
          </button>
        )}

        {/* Back-to-top at top when visible */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-brand-primary hover:bg-slate-800 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
            aria-label="Back to top"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="hidden lg:block">
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-brand-primary hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-40 flex items-center justify-center"
            aria-label="Back to top"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        )}

        {showNewsletter && onNewsletterClick && (
          <button
            onClick={onNewsletterClick}
            className="fixed bottom-6 right-6 bg-brand-red hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-40 flex items-center justify-center"
            aria-label="Subscribe to newsletter"
          >
            <Mail className="h-6 w-6" />
          </button>
        )}

        <div className="fixed bottom-6 right-6 z-50">
          <WhatsAppFab onClick={() => setIsWhatsAppPanelOpen(true)} />
        </div>
      </div>

      {/* WhatsApp chat panel */}
      <WhatsAppChatPanel isOpen={isWhatsAppPanelOpen} onClose={() => setIsWhatsAppPanelOpen(false)} />
    </>
  )
}
