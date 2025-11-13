import type { Product } from "./types"

/**
 * Determines if a product should be treated as a "bulk" product.
 * Returns true if ANY of the following conditions are met:
 * 1) Product is in a collection with handle === "bulk" (if collectionHandle is provided)
 * 2) Metafield "custom.bulk_type" is a non-empty string
 * 3) Metafield "custom.occasion" contains "bulk" (case-insensitive)
 *
 * @param product - The product to check
 * @param collectionHandle - Optional collection handle to check against
 * @returns true if the product is a bulk product, false otherwise
 */
export function isBulkProduct(product: Product, collectionHandle?: string): boolean {
  // Check 1: Is product in "bulk" collection?
  if (collectionHandle && collectionHandle.toLowerCase() === "bulk") {
    return true
  }

  // Check 2: Does product have bulk_type metafield?
  if (product.bulk_type && product.bulk_type.trim().length > 0) {
    return true
  }

  // Check 3: Does occasion metafield contain "bulk"?
  if (product.occasion && Array.isArray(product.occasion)) {
    // occasion is already parsed as an array
    const hasBulk = product.occasion.some((occ) => occ.toLowerCase().trim() === "bulk")
    if (hasBulk) {
      return true
    }
  }

  return false
}

/**
 * Validates and normalizes a household size value.
 * Returns the value if it's in the allowed set, otherwise returns null.
 *
 * @param value - The household size value to validate
 * @returns The validated value or null
 */
export function validateHouseholdSize(value: string | undefined): string | null {
  if (!value) return null

  const allowedSizes = ["2", "4", "6", "8", "10"]
  const normalized = value.trim()

  return allowedSizes.includes(normalized) ? normalized : null
}
