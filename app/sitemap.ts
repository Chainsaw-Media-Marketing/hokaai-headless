import type { MetadataRoute } from "next"
import { shopifyFetch } from "@/lib/shopify"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hokaai.co.za"

const COLLECTIONS_QUERY = `
  query Collections {
    collections(first: 50) {
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`

const PRODUCTS_QUERY = `
  query Products {
    products(first: 250) {
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/game-processing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/spitbraai-hire`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/delivery-info`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  try {
    // Fetch collections
    const collectionsData = await shopifyFetch<any>(COLLECTIONS_QUERY, {})
    const collections: MetadataRoute.Sitemap =
      collectionsData?.collections?.edges?.map((edge: any) => ({
        url: `${baseUrl}/collections/${edge.node.handle}`,
        lastModified: new Date(edge.node.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })) || []

    // Fetch products
    const productsData = await shopifyFetch<any>(PRODUCTS_QUERY, {})
    const products: MetadataRoute.Sitemap =
      productsData?.products?.edges?.map((edge: any) => ({
        url: `${baseUrl}/products/${edge.node.handle}`,
        lastModified: new Date(edge.node.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })) || []

    return [...staticPages, ...collections, ...products]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    // Return only static pages if Shopify fetch fails
    return staticPages
  }
}
