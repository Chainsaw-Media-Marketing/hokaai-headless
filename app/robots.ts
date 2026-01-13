import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hokaai.co.za"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/order/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
