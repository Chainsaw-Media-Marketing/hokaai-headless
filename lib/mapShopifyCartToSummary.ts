/**
 * Centralized mapper: Shopify cart → CartHydratePayload
 * Single source of truth for cart state hydration
 */

export interface CartHydratePayload {
  cartId: string | null
  checkoutUrl: string | null
  lineCount: number
  itemCount: number
  subtotalAmount: number // cents or minor units
  currencyCode: string
  lines: Array<{
    id: string
    title: string
    variantId: string
    quantity: number
    unitPrice: number // minor units
    lineAmount: number // unitPrice * quantity
    imageUrl?: string
    productHandle: string
    attributes?: Array<{ key: string; value: string }>
    weight?: number
    weightUnit?: string
  }>
}

export function mapShopifyCartToSummary(shopifyCart: any): CartHydratePayload {
  // Handle null/undefined cart safely
  if (!shopifyCart) {
    return {
      cartId: null,
      checkoutUrl: null,
      lineCount: 0,
      itemCount: 0,
      subtotalAmount: 0,
      currencyCode: "ZAR",
      lines: [],
    }
  }

  const cartId = shopifyCart?.id || null
  const checkoutUrl = shopifyCart?.checkoutUrl || null
  const currencyCode = shopifyCart?.cost?.totalAmount?.currencyCode || "ZAR"

  // Safely handle missing lines.edges
  const edges = Array.isArray(shopifyCart?.lines?.edges) ? shopifyCart.lines.edges : []

  const lines = edges.map((edge: any) => {
    const node = edge?.node
    const merch = node?.merchandise
    const product = merch?.product

    // Parse price from Shopify (string) to minor units (cents)
    const priceAmount = merch?.price?.amount || merch?.priceV2?.amount || "0"
    const unitPrice = Math.round(Number.parseFloat(priceAmount) * 100) // Convert to cents

    const quantity = node?.quantity || 1
    const lineAmount = unitPrice * quantity

    const attributes = Array.isArray(node?.attributes)
      ? node.attributes.map((attr: any) => ({
          key: attr?.key || "",
          value: attr?.value || "",
        }))
      : []

    return {
      id: node?.id || "",
      title: `${product?.title || ""} - ${merch?.title || ""}`.replace(" - Default Title", ""),
      variantId: merch?.id || "",
      quantity,
      unitPrice,
      lineAmount,
      imageUrl: merch?.image?.url || product?.featuredImage?.url,
      productHandle: product?.handle || "",
      attributes,
      weight: merch?.weight,
      weightUnit: merch?.weightUnit,
    }
  })

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const lineCount = lines.length
  const subtotalAmount = lines.reduce((sum, line) => sum + line.lineAmount, 0)

  return {
    cartId,
    checkoutUrl,
    lineCount,
    itemCount,
    subtotalAmount,
    currencyCode,
    lines,
  }
}
