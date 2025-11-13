import type { Product, ShopifyVariant } from "./types"

// Shopify product type based on our GraphQL queries
interface ShopifyProduct {
  id: string
  title: string
  handle: string
  descriptionHtml?: string
  featuredImage?: {
    url: string
    altText?: string
  }
  images?: {
    edges: Array<{
      node: {
        url: string
        altText?: string
        width?: number
        height?: number
      }
    }>
  }
  variants?: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        compareAtPrice?: {
          amount: string
          currencyCode: string
        } | null
        availableForSale: boolean
        weight: number
        weightUnit: "KILOGRAMS" | "GRAMS" | "POUNDS" | "OUNCES"
        sku?: string
      }
    }>
  }
  priceRange?: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  meatType?: {
    value: string
  } | null
  cutFamily?: {
    value: string
  } | null
  occasion?: {
    value: string
  } | null
  department?: {
    value: string
  } | null
  bulkType?: {
    value: string
  } | null
  deliType?: {
    value: string
  } | null
  pricePerKg?: {
    value: string
  } | null
}

/**
 * Maps a Shopify product to our internal Product type
 */
export function mapShopifyProductToProduct(p: ShopifyProduct): Product {
  // Parse occasion metafield - could be comma-separated or JSON array
  let occasionArray: string[] = []
  if (p.occasion?.value) {
    try {
      // Try parsing as JSON array first
      const parsed = JSON.parse(p.occasion.value)
      occasionArray = Array.isArray(parsed) ? parsed : [p.occasion.value]
    } catch {
      // If not JSON, split by comma
      occasionArray = p.occasion.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }

  const variants: ShopifyVariant[] = p.variants?.edges?.map((e) => e.node) ?? []

  const availableVariants = variants.filter((v) => v.availableForSale)
  const variantsToCheck = availableVariants.length > 0 ? availableVariants : variants
  const minVariantPrice =
    variantsToCheck.length > 0
      ? Math.min(...variantsToCheck.map((v) => Number.parseFloat(v.price.amount)))
      : p.priceRange?.minVariantPrice
        ? Number.parseFloat(p.priceRange.minVariantPrice.amount)
        : 0

  let price_per_kg: number | undefined
  if (p.pricePerKg?.value) {
    try {
      const parsed = JSON.parse(p.pricePerKg.value)
      const pricePerKgValue = Number.parseFloat(parsed.amount)
      if (!isNaN(pricePerKgValue)) {
        price_per_kg = pricePerKgValue
      }
    } catch (error) {
      console.error("[v0] Failed to parse price_per_kg metafield:", error)
    }
  }

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    image: p.featuredImage?.url ?? p.images?.edges?.[0]?.node?.url ?? null,
    pricePerKg: minVariantPrice, // Using min variant price as base price
    tags: [], // Placeholder - will be enriched later
    description: p.descriptionHtml,
    images: p.images?.edges?.map((e) => e.node.url) ?? [],
    meat_type: p.meatType?.value ?? undefined,
    cut_family: p.cutFamily?.value ?? undefined,
    occasion: occasionArray.length > 0 ? occasionArray : undefined,
    department: p.department?.value ?? undefined,
    bulk_type: p.bulkType?.value ?? undefined,
    deli_type: p.deliType?.value ?? undefined,
    variants,
    minVariantPrice,
    price_per_kg,
  }
}
