"use client"

import Link from "next/link"
import { SocialIcons } from "./social-icons"
import { useState } from "react"
import { NewsletterFooterForm } from "./newsletter-footer-form"

const MapPinIcon = () => (
  <svg className="h-5 w-5 mt-0.5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-5 w-5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const MailIcon = () => (
  <svg className="h-5 w-5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-5 w-5 mt-0.5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

function Footer() {
  const currentYear = new Date().getFullYear()
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  const copyToClipboard = (text: string): boolean => {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text)
      })
      return true
    } else {
      // Use fallback for non-secure contexts
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
    // Open mailto/tel link
    window.location.href = href
  }

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon />
                <div>
                  <p>Hokaai Shopping Centre</p>
                  <p>558 Graaff Reinet St, Faerie Glen</p>
                  <p>Pretoria, 0081</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 relative">
                <PhoneIcon />
                <button
                  onClick={() => handleCopyAndOpen("phone", "012 991 2801", "tel:+27129912801")}
                  className="hover:text-brand-red transition-colors cursor-pointer text-left"
                >
                  012 991 2801
                </button>
                {copiedItem === "phone" && (
                  <span className="absolute -top-8 left-8 bg-brand-success text-white text-xs px-2 py-1 rounded shadow-lg">
                    Copied!
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 relative">
                <MailIcon />
                <button
                  onClick={() =>
                    handleCopyAndOpen("email", "info@hokaaimeatmarket.co.za", "mailto:info@hokaaimeatmarket.co.za")
                  }
                  className="hover:text-brand-red transition-colors cursor-pointer text-left"
                >
                  info@hokaaimeatmarket.co.za
                </button>
                {copiedItem === "email" && (
                  <span className="absolute -top-8 left-8 bg-brand-success text-white text-xs px-2 py-1 rounded shadow-lg">
                    Copied!
                  </span>
                )}
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon />
                <div>
                  <p className="font-semibold mb-1">Store Hours:</p>
                  <p>Mon-Fri: 8:30 AM - 6:00 PM</p>
                  <p>Sat: 8:00 AM - 4:00 PM</p>
                  <p>Sun: 9:00 AM - 1:00 PM</p>
                  <p className="font-semibold mt-2 mb-1">Delivery Hours:</p>
                  <p>Mon: 9:30 AM - 4:00 PM</p>
                  <p>Tue-Fri: 9:00 AM - 4:00 PM</p>
                  <p>Sat: 9:00 AM - 3:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/collections/beef"
                  onClick={handleLinkClick}
                  className="hover:text-brand-red transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/game-processing"
                  onClick={handleLinkClick}
                  className="hover:text-brand-red transition-colors"
                >
                  Game Processing
                </Link>
              </li>
              <li>
                <Link
                  href="/spitbraai-hire"
                  onClick={handleLinkClick}
                  className="hover:text-brand-red transition-colors"
                >
                  Spitbraai Hire
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={handleLinkClick} className="hover:text-brand-red transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={handleLinkClick} className="hover:text-brand-red transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/recipes" onClick={handleLinkClick} className="hover:text-brand-red transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery-info"
                  onClick={handleLinkClick}
                  className="hover:text-brand-red transition-colors"
                >
                  Delivery Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Online Store */}
          <div className="hidden lg:block">
            <h3 className="font-heading font-semibold text-xl mb-6">Online Store</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-200">Secure card payments via PayGate</p>
              <div className="flex space-x-4">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-sm">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-red-600 font-bold text-sm">MC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Stay Updated</h3>
            <p className="text-sm text-gray-200 mb-4 lg:block">
              Get the latest news, recipes, and special offers delivered to your inbox.
            </p>
            <NewsletterFooterForm />
            <p className="text-xs text-gray-400 mt-2">By subscribing, you agree to our privacy policy.</p>

            <div className="mt-6 flex justify-center lg:justify-center">
              <SocialIcons className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/legal/terms-and-conditions.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/privacy-policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/paia-manual.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    PAIA Manual
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2 flex flex-col md:flex-row justify-between items-start md:items-center">
              <p className="text-sm text-gray-400">© {currentYear} HOKAAI VLEISMARK CC. All rights reserved.</p>
              <p className="text-xs text-gray-500 mt-2 md:mt-0">CK Number: 1994/00211923</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export default Footer
