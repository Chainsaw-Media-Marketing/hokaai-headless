import { shopifyFetch } from "@/lib/shopify"
import type { Product } from "@/lib/types"

export type StockedItem = {
  handle: string
  qty: number
  unit?: string
  note?: string
}

export type ResolvedProduct = {
  variantId: string | null
  available: boolean
  title: string
  product: Product | null
}

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      availableForSale
      featuredImage {
        url
        altText
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          weight
          weightUnit
        }
      }
    }
  }
`

/**
 * Resolves product variants by handles from Shopify Storefront API
 * Returns a map of handle -> resolved product info
 */
export async function resolveVariantsByHandles(handles: string[]): Promise<Record<string, ResolvedProduct>> {
  const resolved: Record<string, ResolvedProduct> = {}

  // Fetch products in parallel
  await Promise.all(
    handles.map(async (handle) => {
      try {
        const data = await shopifyFetch<{ product: any }>(PRODUCT_BY_HANDLE_QUERY, { handle })

        if (!data.product) {
          resolved[handle] = {
            variantId: null,
            available: false,
            title: handle,
            product: null,
          }
          return
        }

        const product = data.product
        const variants = product.variants?.nodes || []

        // Find first available variant, or fallback to first variant
        const availableVariant = variants.find((v: any) => v.availableForSale)
        const selectedVariant = availableVariant || variants[0]

        if (!selectedVariant) {
          resolved[handle] = {
            variantId: null,
            available: false,
            title: product.title,
            product: null,
          }
          return
        }

        // Map to Product type
        const mappedProduct: Product = {
          id: product.id,
          title: product.title,
          handle: product.handle,
          image: product.featuredImage?.url || null,
          pricePerKg: Number.parseFloat(product.priceRange?.minVariantPrice?.amount || "0"),
          tags: [],
          availableForSale: product.availableForSale,
          variants: variants.map((v: any) => ({
            id: v.id,
            title: v.title,
            price: v.price,
            availableForSale: v.availableForSale,
            weight: v.weight,
            weightUnit: v.weightUnit,
          })),
        }

        resolved[handle] = {
          variantId: selectedVariant.id,
          available: selectedVariant.availableForSale,
          title: product.title,
          product: mappedProduct,
        }
      } catch (error) {
        console.error(`[v0] Failed to resolve product ${handle}:`, error)
        resolved[handle] = {
          variantId: null,
          available: false,
          title: handle,
          product: null,
        }
      }
    }),
  )

  return resolved
}

/**
 * Builds cart line data for adding to cart
 * Filters out unavailable items and adds recipe attributes
 */
export function buildCartLinesData(
  items: StockedItem[],
  resolved: Record<string, ResolvedProduct>,
  recipeSlug: string,
): Array<{
  product: Product
  quantity: number
  variantId: string
  variantPrice: number
}> {
  const lines: Array<{
    product: Product
    quantity: number
    variantId: string
    variantPrice: number
  }> = []

  for (const item of items) {
    const resolvedProduct = resolved[item.handle]
    if (!resolvedProduct || !resolvedProduct.variantId || !resolvedProduct.available || !resolvedProduct.product) {
      continue
    }

    const variant = resolvedProduct.product.variants?.[0]
    const variantPrice = variant ? Number.parseFloat(variant.price.amount) : resolvedProduct.product.pricePerKg

    lines.push({
      product: resolvedProduct.product,
      quantity: item.qty,
      variantId: resolvedProduct.variantId,
      variantPrice,
    })
  }

  return lines
}
