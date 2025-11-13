import { shopifyFetch } from "@/lib/shopify"

export const revalidate = 300

const PRODUCTS_BY_COLLECTION = /* GraphQL */ `
  query ProductsByCollection($handle: String!, $first: Int = 8) {
    collection(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  }
`

export interface MenuProduct {
  id: string
  title: string
  handle: string
  imageUrl: string
  imageAlt: string
}

export async function getMenuProducts(handle: string, first = 8): Promise<MenuProduct[]> {
  try {
    const data = await shopifyFetch<any>(PRODUCTS_BY_COLLECTION, { handle, first })
    const edges = data?.collection?.products?.edges ?? []
    return edges.map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      handle: e.node.handle,
      imageUrl: e.node.featuredImage?.url ?? "",
      imageAlt: e.node.featuredImage?.altText ?? e.node.title,
    }))
  } catch (error) {
    console.error(`[v0] Failed to fetch menu products for collection "${handle}":`, error)
    return []
  }
}
