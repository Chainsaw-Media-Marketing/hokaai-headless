import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Oswald, Open_Sans } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { BackToTopButton } from "@/components/back-to-top-button"
import { ShopifyAutoWireInit } from "@/components/shopify-auto-wire-init"
import { WhatsAppWidget } from "@/components/whatsapp-widget"
import { CookieBar } from "@/components/cookie-bar"
import { ConsentAnalytics } from "@/components/consent-analytics"

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-oswald",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "Hokaai Meat Market - Premium Quality Meats",
  description:
    "Premium quality meats from Hokaai Meat Market. Shop fresh cuts, freezer packs and more online with local delivery available.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${openSans.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          {children}
          <BackToTopButton />
          <ShopifyAutoWireInit />
          <WhatsAppWidget />
          <CookieBar />
          <ConsentAnalytics />
        </CartProvider>
      </body>
    </html>
  )
}
