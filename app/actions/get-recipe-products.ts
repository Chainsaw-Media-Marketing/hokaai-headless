"use server"

import { shopifyFetch } from "@/lib/shopify"
import { parseMetafieldValue } from "@/lib/filter-utils"
import type { Product } from "@/lib/types"

const buildProductsByHandleQuery = (handles: string[]) => {
  const productFields = `
    id
    handle
    title
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
      edges {
        node {
          id
          title
          availableForSale
          priceV2 {
            amount
            currencyCode
          }
          weight
          weightUnit
        }
      }
    }
    meatType: metafield(namespace: "custom", key: "meat_type") {
      value
    }
    cutFamily: metafield(namespace: "custom", key: "cut_family") {
      value
    }
    occasion: metafield(namespace: "custom", key: "occasion") {
      value
    }
    department: metafield(namespace: "custom", key: "department") {
      value
    }
    bulkType: metafield(namespace: "custom", key: "bulk_type") {
      value
    }
    deliType: metafield(namespace: "custom", key: "deli_type") {
      value
    }
    spiceFamily: metafield(namespace: "custom", key: "spice_family") {
      value
    }
    braaiGearFamily: metafield(namespace: "custom", key: "braai_gear_family") {
      value
    }
    groceryFamily: metafield(namespace: "custom", key: "grocery_family") {
      value
    }
    pricePerKg: metafield(namespace: "custom", key: "price_per_kg") {
      value
    }
  `

  const aliases = handles
    .map((handle, index) => {
      return `product${index}: productByHandle(handle: "${handle}") { ${productFields} }`
    })
    .join("\n")

  return `query { ${aliases} }`
}

const toProduct = (p: any): Product => {
  const imageUrl = p.featuredImage?.url || null

  const mappedProduct: Product = {
    id: p.id,
    handle: p.handle,
    title: p.title,
    image: imageUrl,
    pricePerKg: Number.parseFloat(p.priceRange?.minVariantPrice?.amount ?? "0"),
    tags: [],
    description: "",
    images: imageUrl ? [imageUrl] : [],
    meat_type: parseMetafieldValue(p.meatType?.value)[0],
    cut_family: parseMetafieldValue(p.cutFamily?.value)[0],
    occasion: parseMetafieldValue(p.occasion?.value),
    department: parseMetafieldValue(p.department?.value)[0],
    deli_type: parseMetafieldValue(p.deliType?.value)[0],
    spice_family: parseMetafieldValue(p.spiceFamily?.value)[0],
    braai_gear_family: parseMetafieldValue(p.braaiGearFamily?.value)[0],
    grocery_family: parseMetafieldValue(p.groceryFamily?.value)[0],
    bulk_type: parseMetafieldValue(p.bulkType?.value)[0],
    variants: (p.variants?.edges ?? []).map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      price: {
        amount: e.node.priceV2?.amount ?? "0",
        currencyCode: e.node.priceV2?.currencyCode ?? "ZAR",
      },
      availableForSale: e.node.availableForSale ?? false,
      weight: e.node.weight ?? 0,
      weightUnit: e.node.weightUnit ?? "GRAMS",
    })),
  }

  if (p.pricePerKg?.value) {
    try {
      const parsed = JSON.parse(p.pricePerKg.value)
      const pricePerKgValue = Number.parseFloat(parsed.amount)
      if (!isNaN(pricePerKgValue)) {
        mappedProduct.price_per_kg = pricePerKgValue
      }
    } catch {
      // Ignore parsing errors
    }
  }

  return mappedProduct
}

export async function getRecipeProducts(handles: string[]): Promise<Product[]> {
  if (handles.length === 0) return []

  try {
    const query = buildProductsByHandleQuery(handles)
    const data = await shopifyFetch<any>(query)

    const products: Product[] = []
    for (let i = 0; i < handles.length; i++) {
      const productData = data[`product${i}`]
      if (productData) {
        products.push(toProduct(productData))
      }
    }

    return products
  } catch (error) {
    console.error("[v0] Failed to fetch recipe products:", error)
    return []
  }
}
