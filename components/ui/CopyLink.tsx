"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CopyLink() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs" title="Copy link to this recipe">
      {copied ? "✓ Copied!" : "Share"}
    </Button>
  )
}
