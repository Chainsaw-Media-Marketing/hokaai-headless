"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

const STORAGE_KEY = "hk_cookie_consent"

export function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkConsent = () => {
      const value = window.localStorage.getItem(STORAGE_KEY)
      setEnabled(value === "accepted_all")
    }

    checkConsent()

    const handler = (event: Event) => {
      const custom = event as CustomEvent
      const consent = custom.detail?.consent
      if (consent === "accepted_all") {
        setEnabled(true)
      } else if (consent === "essential_only") {
        setEnabled(false)
      }
    }

    window.addEventListener("hk-cookie-consent-change", handler)
    return () => window.removeEventListener("hk-cookie-consent-change", handler)
  }, [])

  if (!enabled) return null

  return (
    <>
      {/* Meta Pixel - only loads when user has accepted all cookies */}
      <Script id="meta-pixel" strategy="afterInteractive">
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
      {/* Add GA4 or other analytics scripts here as needed */}
    </>
  )
}
