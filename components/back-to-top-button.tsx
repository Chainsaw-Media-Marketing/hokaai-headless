"use client"

import { useState, useEffect } from "react"

const ChevronUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [newsletterVisible, setNewsletterVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  useEffect(() => {
    const checkNewsletterButton = () => {
      const newsletterBtn = document.querySelector('[data-floating-button="newsletter"]')
      setNewsletterVisible(!!newsletterBtn)
    }

    checkNewsletterButton()
    const interval = setInterval(checkNewsletterButton, 500)

    return () => clearInterval(interval)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      data-floating-button="back-to-top"
      className={`fixed right-4 w-12 h-12 lg:bottom-8 lg:right-8 lg:w-auto lg:h-auto bg-brand-primary hover:bg-slate-800 text-white p-3 lg:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-40 flex items-center justify-center ${
        newsletterVisible ? "bottom-[136px]" : "bottom-[76px]"
      }`}
      aria-label="Back to top"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  )
}
