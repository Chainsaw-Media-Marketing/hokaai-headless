import { type NextRequest, NextResponse } from "next/server"
import { shopifyFetch } from "@/lib/shopify"

const PRODUCT_IMAGES_QUERY = `
  query getProductImages($handles: [String!]!) {
    nodes(ids: $handles) {
      ... on Product {
        id
        handle
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
`

const PRODUCTS_BY_HANDLES_QUERY = `
  query getProductsByHandles($query: String!) {
    products(first: 50, query: $query) {
      edges {
        node {
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const handlesParam = searchParams.get("handles")

    if (!handlesParam) {
      return NextResponse.json({ error: "Missing handles parameter" }, { status: 400 })
    }

    const handles = handlesParam.split(",").filter(Boolean)

    if (handles.length === 0) {
      return NextResponse.json({ images: {} })
    }

    // Build query string for Shopify search
    const queryString = handles.map((handle) => `handle:${handle}`).join(" OR ")

    // Fetch products from Shopify
    const data = await shopifyFetch<{
      products: {
        edges: Array<{
          node: {
            handle: string
            images: {
              edges: Array<{
                node: {
                  url: string
                  altText: string | null
                }
              }>
            }
          }
        }>
      }
    }>(PRODUCTS_BY_HANDLES_QUERY, { query: queryString })

    // Map handles to image URLs
    const images: Record<string, string> = {}

    data.products.edges.forEach((edge) => {
      const product = edge.node
      const firstImage = product.images.edges[0]?.node
      if (firstImage) {
        images[product.handle] = firstImage.url
      }
    })

    return NextResponse.json(
      { images },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error fetching product images:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const runtime = "edge"
