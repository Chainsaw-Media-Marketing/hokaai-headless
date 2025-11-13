import { type NextRequest, NextResponse } from "next/server"
import { shopifyFetch } from "@/lib/shopify"
import { mapShopifyProductToProduct } from "@/lib/map"

const PRODUCTS_BY_HANDLES_QUERY = `
  query getProductsByHandles($query: String!) {
    products(first: 50, query: $query) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                priceV2 {
                  amount
                  currencyCode
                }
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
                weight
                weightUnit
              }
            }
          }
          meatType: metafield(namespace: "custom", key: "meat_type") {
            value
          }
          cutFamily: metafield(namespace: "custom", key: "cut_family") {
            value
          }
          occasion: metafield(namespace: "custom", key: "occasion") {
            value
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

    // Parse handles from comma-separated string
    const handles = handlesParam.split(",").filter(Boolean)

    if (handles.length === 0) {
      return NextResponse.json({ products: [] })
    }

    console.log(`[v0] Fetching ${handles.length} products by handles:`, handles)

    const queryString = handles.map((handle) => `handle:${handle}`).join(" OR ")

    // Fetch products from Shopify
    const { data, errors } = await shopifyFetch({
      query: PRODUCTS_BY_HANDLES_QUERY,
      variables: { query: queryString },
    })

    if (errors) {
      console.error("[v0] Shopify API errors:", errors)
      return NextResponse.json({ error: "Failed to fetch products", details: errors }, { status: 500 })
    }

    const edges = data?.products?.edges || []
    const products = edges
      .map((edge: any) => edge.node)
      .filter((node: any) => node && node.handle) // Filter out null nodes
      .map((product: any) => mapShopifyProductToProduct(product))

    console.log(`[v0] Successfully fetched ${products.length} products`)

    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error fetching products by handles:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const runtime = "edge"
export const dynamic = "force-dynamic"
