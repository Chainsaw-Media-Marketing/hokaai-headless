import { shopifyFetch } from "@/lib/shopify"

const Q = /* GraphQL */ `
  query CollectionDebug($handle: String!, $first: Int = 50) {
    collection(handle: $handle) {
      title
      handle
      products(first: $first) {
        edges { node {
          id
          title
          handle
          publishedAt
          onlineStoreUrl
        }}
      }
    }
  }
`

export async function GET(req: Request) {
  const url = new URL(req.url)
  const handle = url.searchParams.get("handle") || "beef"
  try {
    const data = await shopifyFetch<any>(Q, { handle })
    const nodes = data?.collection?.products?.edges?.map((e: any) => e.node) ?? []
    return new Response(JSON.stringify({ count: nodes.length, sample: nodes.slice(0, 5) }, null, 2), {
      headers: { "content-type": "application/json" },
    })
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 })
  }
}
