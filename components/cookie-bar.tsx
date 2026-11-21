"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

const STORAGE_KEY = "hk_cookie_consent"
type ConsentValue = "accepted_all" | "essential_only"

const SCROLL_ACCEPT_THRESHOLD = 200

export function CookieBar() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  const shownOnPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const existing = window.localStorage.getItem(STORAGE_KEY)
    if (!existing) {
      setVisible(true)
    }
  }, [])

  const handleChoice = useCallback((value: ConsentValue) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value)
      window.dispatchEvent(
        new CustomEvent("hk-cookie-consent-change", {
          detail: { consent: value },
        }),
      )
    }
    setVisible(false)
  }, [])

  useEffect(() => {
    if (!visible) {
      shownOnPathRef.current = null
      return
    }
    if (shownOnPathRef.current === null) {
      shownOnPathRef.current = pathname
      return
    }
    if (pathname !== shownOnPathRef.current) {
      handleChoice("accepted_all")
    }
  }, [visible, pathname, handleChoice])

  useEffect(() => {
    if (!visible) return

    const startY = window.scrollY
    const onScroll = () => {
      if (window.scrollY - startY >= SCROLL_ACCEPT_THRESHOLD) {
        handleChoice("accepted_all")
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [visible, handleChoice])

  if (!visible) return null

  return (
    <div role="region" aria-label="Cookie notice" className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-6xl px-4 pb-4 sm:pr-16 lg:pr-24">
        <div className="relative rounded-xl bg-neutral-900/95 text-neutral-100 shadow-lg ring-1 ring-black/40">
          <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
            <p className="pr-10 text-xs leading-snug text-neutral-300 sm:flex-1 sm:pr-0">
              We use cookies to improve your shopping and understand how our site is used. By continuing to browse, you
              accept cookies.{" "}
              <a
                href="/legal/privacy-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-300 underline underline-offset-2 hover:text-red-200"
              >
                Privacy policy
              </a>
            </p>

            <div className="flex items-center gap-2 pr-12 sm:shrink-0 sm:pr-0">
              <button
                type="button"
                onClick={() => handleChoice("accepted_all")}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-none"
              >
                Accept all cookies
              </button>
              <button
                type="button"
                onClick={() => handleChoice("essential_only")}
                className="inline-flex min-h-11 items-center justify-center px-2 text-xs text-neutral-200 underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Only essential
              </button>
              <button
                type="button"
                aria-label="Close and accept cookies"
                onClick={() => handleChoice("accepted_all")}
                className="absolute right-0 top-0 inline-flex size-11 items-center justify-center rounded-full text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:static"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
