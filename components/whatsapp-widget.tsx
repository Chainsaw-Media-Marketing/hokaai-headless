"use client"

import { useState } from "react"
import { WhatsAppFab } from "./whatsapp-fab"
import { WhatsAppChatPanel } from "./whatsapp-chat-panel"

export function WhatsAppWidget() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <>
      <WhatsAppFab onClick={() => setIsPanelOpen(true)} />
      <WhatsAppChatPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  )
}
