"use client"

import type React from "react"
import { CartProvider } from "@/lib/cart-context"
import { BackToTopButton } from "@/components/back-to-top-button"
import { ShopifyAutoWireInit } from "@/components/shopify-auto-wire-init"
import { WhatsAppFab } from "@/components/whatsapp-fab"
import { WhatsAppChatPanel } from "@/components/whatsapp-chat-panel"
import { useState } from "react"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isWhatsAppPanelOpen, setIsWhatsAppPanelOpen] = useState(false)

  return (
    <CartProvider>
      {children}
      <BackToTopButton />
      <ShopifyAutoWireInit />
      <WhatsAppFab onClick={() => setIsWhatsAppPanelOpen(true)} />
      <WhatsAppChatPanel isOpen={isWhatsAppPanelOpen} onClose={() => setIsWhatsAppPanelOpen(false)} />
    </CartProvider>
  )
}
