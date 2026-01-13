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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hokaai.co.za"),
  title: {
    default: "Hokaai Meat Market - Premium Quality Meats, Deli & Biltong",
    template: "%s | Hokaai Meat Market",
  },
  description:
    "Order premium quality meats, deli and biltong online from Hokaai Meat Market. Local delivery in Gauteng. Fresh cuts, braai essentials and bulk hampers.",
  keywords: [
    "butchery",
    "meat market",
    "online meat delivery",
    "Gauteng meat delivery",
    "biltong",
    "deli",
    "braai meat",
    "fresh meat",
    "Pretoria butcher",
    "Centurion meat",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Hokaai Meat Market",
    title: "Hokaai Meat Market - Premium Quality Meats, Deli & Biltong",
    description:
      "Order premium quality meats, deli and biltong online from Hokaai Meat Market. Local delivery in Gauteng. Fresh cuts, braai essentials and bulk hampers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hokaai Meat Market - Premium Quality Meats, Deli & Biltong",
    description:
      "Order premium quality meats, deli and biltong online from Hokaai Meat Market. Local delivery in Gauteng. Fresh cuts, braai essentials and bulk hampers.",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.jpg", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.jpg", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.jpg", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
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
