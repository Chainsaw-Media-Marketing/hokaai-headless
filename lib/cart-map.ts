/**
 * Maps Shopify cart response to local CartStateItem format
 * Supports both Mode A (price_per_kg) and Mode B (variantPrice)
 */

import type { CartItem } from "@/lib/types"

export interface CartStateItem extends CartItem {}

export function mapShopifyCartToLocal(cart: any): {
  items: CartStateItem[]
  itemCount: number
  total: number
} {
  const edges = cart?.lines?.edges ?? []
  const items: CartStateItem[] = edges.map((e: any) => {
    const n = e?.node
    const merch = n?.merchandise
    const variantPrice = Number(
      merch?.priceV2?.amount ?? merch?.price?.amount ?? n?.cost?.amountPerQuantity?.amount ?? 0,
    )
    const quantity = Number(n?.quantity ?? 1)
    const attrs = (n?.attributes ?? []).map((a: any) => ({ key: a?.key ?? "", value: a?.value ?? "" }))

    // Try to detect optional custom attributes (e.g., household_size, price_per_kg, weight)
    const attr = (k: string) => attrs.find((a) => a.key === k)?.value
    const pricePerKgAttr = Number(attr("price_per_kg") ?? Number.NaN)
    const weightKgAttr = Number(attr("weight") ?? attr("weight_kg") ?? Number.NaN)

    // Get weight from merchandise or attributes
    let weightKg = weightKgAttr
    if (!Number.isFinite(weightKg) && merch?.weight && merch?.weight > 0) {
      weightKg = merch?.weightUnit === "GRAMS" ? merch.weight / 1000 : merch.weight
    }
    if (!Number.isFinite(weightKg)) {
      weightKg = 1.0 // Default fallback
    }

    // Mode A: price_per_kg * weight * qty ; else Mode B: unit price * qty
    const pricePerKg = Number.isFinite(pricePerKgAttr) ? pricePerKgAttr : variantPrice
    const lineTotal =
      Number.isFinite(pricePerKgAttr) && Number.isFinite(weightKg)
        ? pricePerKgAttr * weightKg * quantity
        : variantPrice * quantity

    const productTitle = merch?.product?.title ?? n?.title ?? ""
    const variantTitle = merch?.title ?? ""
    const variantId = merch?.id ?? ""
    const productHandle = merch?.product?.handle ?? ""

    return {
      id: n?.id ?? variantId, // ui line id fallback
      productId: merch?.product?.id ?? "",
      productHandle,
      title: variantTitle && variantTitle !== "Default Title" ? `${productTitle} - ${variantTitle}` : productTitle,
      variantId,
      quantity,
      attributes: attrs,
      pricePerKg,
      weight: weightKg,
      weightKg: Number.isFinite(weightKg) ? weightKg : undefined,
      lineTotal,
      image: merch?.image?.url ?? merch?.product?.featuredImage?.url ?? null,
      variantWeightGrams: weightKg * 1000,
      price_per_kg: Number.isFinite(pricePerKgAttr) ? pricePerKgAttr : undefined,
      variantPrice,
      variantTitle,
    } as CartStateItem
  })

  const itemCount = items.reduce((n, it) => n + (it.quantity || 0), 0)
  const total = items.reduce((n, it) => n + (it.lineTotal || 0), 0)
  return { items, itemCount, total }
}
