const SHOPIFY_STOREFRONT_DOMAIN = process.env.SHOPIFY_STOREFRONT_DOMAIN
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01"

if (!SHOPIFY_STOREFRONT_DOMAIN) {
  throw new Error("Missing SHOPIFY_STOREFRONT_DOMAIN environment variable")
}

if (!SHOPIFY_STOREFRONT_TOKEN) {
  throw new Error("Missing SHOPIFY_STOREFRONT_TOKEN environment variable")
}

export const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_STOREFRONT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`

export async function shopifyFetch<T>(query: string, variables?: Record<string, any>, retries = 3): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        next: { revalidate: 60 },
      })

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get("content-type")
      if (contentType && !contentType.includes("application/json")) {
        throw new Error(
          `Shopify API returned non-JSON response (${response.status}). The store may be temporarily unavailable.`,
        )
      }

      if (!response.ok) {
        // For 503 errors, retry with exponential backoff
        if (response.status === 503 && attempt < retries - 1) {
          const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
        throw new Error(`Shopify API request failed: ${response.status} ${response.statusText}`)
      }

      const json = await response.json()

      if (json.errors) {
        throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`)
      }

      return json.data as T
    } catch (error) {
      lastError = error as Error

      // If it's a 503 error and we have retries left, continue to next attempt
      if (error instanceof Error && error.message.includes("503") && attempt < retries - 1) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // For other errors or last attempt, throw immediately
      throw error
    }
  }

  throw lastError || new Error("Shopify API request failed after retries")
}
