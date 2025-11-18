import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { Oswald, Open_Sans } from 'next/font/google'
import { ClientLayout } from "@/app/client-layout"

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
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${openSans.variable}`}>
      <body className="font-body antialiased">
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
        >
          {`
            if (typeof window !== 'undefined') {
              !(function(f,b,e,v,n,t,s){
                if(f.fbq) return;
                n=f.fbq=function(){ n.callMethod ?
                  n.callMethod.apply(n,arguments) : n.queue.push(arguments)
                };
                if(!f._fbq) f._fbq=n;
                n.push=n; n.loaded=!0; n.version='2.0';
                n.queue=[];
                t=b.createElement(e); t.async=!0;
                t.src=v;
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s);
              })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

              var pixelId = '${process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ""}';
              if (pixelId) {
                fbq('init', pixelId);
                fbq('track', 'PageView');
              } else {
                console.warn('[meta-pixel] NEXT_PUBLIC_META_PIXEL_ID is not set');
              }
            }
          `}
        </Script>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
