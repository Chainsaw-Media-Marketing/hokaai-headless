"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "hk_cookie_consent"
type ConsentValue = "accepted_all" | "essential_only"

export function CookieBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const existing = window.localStorage.getItem(STORAGE_KEY)
    if (!existing) {
      setVisible(true)
    }
  }, [])

  const handleChoice = (value: ConsentValue) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value)
      window.dispatchEvent(
        new CustomEvent("hk-cookie-consent-change", {
          detail: { consent: value },
        }),
      )
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-t-xl bg-neutral-900/95 text-sm text-neutral-100 shadow-lg ring-1 ring-black/40">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium">Cookies &amp; privacy</p>
              <p className="text-xs text-neutral-300">
                We use cookies to improve your shopping experience and to understand how our website is used. By
                continuing, you agree to our use of cookies.
              </p>
              <a
                href="/legal/privacy-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-xs text-red-300 underline underline-offset-2 hover:text-red-200"
              >
                View our privacy &amp; cookie policy
              </a>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => handleChoice("essential_only")}
                className="inline-flex items-center justify-center rounded-full border border-neutral-500 px-4 py-2 text-xs font-medium text-neutral-100 hover:bg-neutral-800"
              >
                Only essential
              </button>
              <button
                type="button"
                onClick={() => handleChoice("accepted_all")}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Accept all cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
