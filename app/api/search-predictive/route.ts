import { type NextRequest, NextResponse } from "next/server"
import { shopifyFetch } from "@/lib/shopify"

const PREDICTIVE_SEARCH_QUERY = /* GraphQL */ `
  query PredictiveSearch($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          featuredImage {
            url
            altText
          }
          availableForSale
        }
      }
    }
  }
`

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Use Shopify's search query syntax for better results
    const searchQuery = `title:*${query}* OR tag:*${query}*`

    const data = await shopifyFetch<any>(PREDICTIVE_SEARCH_QUERY, {
      query: searchQuery,
      first: 6,
    })

    const results = (data?.products?.edges || [])
      .filter((edge: any) => edge.node.availableForSale)
      .map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        image: edge.node.featuredImage?.url || "",
      }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Predictive search API error:", error)
    // Fail gracefully - return empty results instead of error
    return NextResponse.json({ results: [] })
  }
}
