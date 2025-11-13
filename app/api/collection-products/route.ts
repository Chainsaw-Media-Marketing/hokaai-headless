import { NextResponse } from "next/server"
import { shopifyFetch } from "@/lib/shopify"
import { COLLECTION_BY_HANDLE } from "@/lib/queries"

export const runtime = "edge"
export const revalidate = 300 // ISR: 5 minutes

function parseMetafieldValue(value: string | undefined): string[] {
  if (!value) return []

  try {
    // Try to parse as JSON array
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v).toLowerCase())
    }
    // If it's a single value, return as array
    return [String(parsed).toLowerCase()]
  } catch {
    // If parsing fails, treat as plain string
    return [value.toLowerCase()]
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const handle = searchParams.get("handle")
  const meatType = searchParams.get("meatType")
  const cutFamily = searchParams.get("cutFamily")

  if (!handle) {
    return NextResponse.json({ error: "Collection handle is required" }, { status: 400 })
  }

  try {
    const data = await shopifyFetch<{
      collection: {
        products: {
          edges: Array<{
            node: {
              id: string
              handle: string
              title: string
              featuredImage?: {
                url: string
                altText?: string
              }
              priceRange: {
                minVariantPrice: {
                  amount: string
                  currencyCode: string
                }
              }
              meatType?: {
                value: string
              }
              cutFamily?: {
                value: string
              }
            }
          }>
        }
      }
    }>(COLLECTION_BY_HANDLE, { handle })

    if (!data?.collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    let products = data.collection.products.edges.map((edge) => edge.node)

    console.log(`[v0] Total products before filtering: ${products.length}`)
    if (products.length > 0) {
      console.log(`[v0] Sample product metafields:`, {
        title: products[0].title,
        meatType: products[0].meatType?.value,
        cutFamily: products[0].cutFamily?.value,
      })
    }

    if (meatType) {
      const beforeCount = products.length
      const filterValue = meatType.toLowerCase()
      products = products.filter((product) => {
        const meatTypes = parseMetafieldValue(product.meatType?.value)
        return meatTypes.includes(filterValue)
      })
      console.log(`[v0] Filtered by meatType=${meatType}, ${beforeCount} -> ${products.length} products`)
    }

    if (cutFamily) {
      const beforeCount = products.length
      const filterValue = cutFamily.toLowerCase()
      products = products.filter((product) => {
        const cutFamilies = parseMetafieldValue(product.cutFamily?.value)
        return cutFamilies.includes(filterValue)
      })
      console.log(`[v0] Filtered by cutFamily=${cutFamily}, ${beforeCount} -> ${products.length} products`)
    }

    // Map to simplified product format for menu (limit to 8)
    const menuProducts = products.slice(0, 8).map((product) => ({
      handle: product.handle,
      title: product.title,
      image: product.featuredImage?.url || "",
      price: Number.parseFloat(product.priceRange.minVariantPrice.amount),
      currency: product.priceRange.minVariantPrice.currencyCode,
    }))

    return NextResponse.json({ products: menuProducts })
  } catch (error) {
    console.error("[v0] Error fetching collection products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
