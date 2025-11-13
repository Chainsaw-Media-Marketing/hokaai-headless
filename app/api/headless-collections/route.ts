import { shopifyFetch } from "@/lib/shopify"

const Q = /* GraphQL */ `
  query {
    collections(first: 100) {
      edges { node { title handle id } }
    }
  }
`

export async function GET() {
  try {
    const data = await shopifyFetch<any>(Q)
    return new Response(
      JSON.stringify(
        data.collections.edges.map((e: any) => e.node),
        null,
        2,
      ),
      {
        headers: { "content-type": "application/json" },
      },
    )
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 })
  }
}
