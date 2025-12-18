import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Oswald, Open_Sans } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { ShopifyAutoWireInit } from "@/components/shopify-auto-wire-init"
import { CookieBar } from "@/components/cookie-bar"
import { ConsentAnalytics } from "@/components/consent-analytics"
import { FloatingActionStack } from "@/components/floating-action-stack"

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
    "Family-run butchery offering premium quality meats, fresh cuts, and traditional South African specialties.",
  generator: "v0.app",
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
          <FloatingActionStack />
          <ShopifyAutoWireInit />
          <CookieBar />
          <ConsentAnalytics />
        </CartProvider>
      </body>
    </html>
  )
}
