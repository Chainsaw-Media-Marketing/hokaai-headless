"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function NewsletterFooterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Successfully subscribed!" })
        setEmail("")
        // Reset message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: "error", text: data.error || "Subscription failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        disabled={loading}
        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50"
      />
      <Button variant="primary" size="sm" type="submit" disabled={loading} className="w-full">
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
      {message && (
        <p className={`text-xs ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
          {message.text}
        </p>
      )}
    </form>
  )
}
