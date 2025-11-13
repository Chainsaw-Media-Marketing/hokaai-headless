import { shopifyFetch, SHOPIFY_GRAPHQL_ENDPOINT } from "@/lib/shopify"
import { NextResponse } from "next/server"

const SHOP_QUERY = `
  query {
    shop {
      name
      primaryDomain {
        url
      }
    }
  }
`

export async function GET() {
  try {
    const data = await shopifyFetch<{
      shop: {
        name: string
        primaryDomain: {
          url: string
        }
      }
    }>(SHOP_QUERY)

    return NextResponse.json(
      {
        success: true,
        endpoint: SHOPIFY_GRAPHQL_ENDPOINT,
        shop: data.shop,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        endpoint: SHOPIFY_GRAPHQL_ENDPOINT,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  }
}
