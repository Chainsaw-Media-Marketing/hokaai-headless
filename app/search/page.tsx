import { shopifyFetch } from "@/lib/shopify"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchPageClient } from "./client"
import { parseMetafieldValue, type FilterState } from "@/lib/filter-utils"
import type { Product } from "@/lib/types"

export const revalidate = 60

const ALL_PRODUCTS_QUERY = /* GraphQL */ `
  query AllProducts($first: Int = 250, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
          tags
          productType
          vendor
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
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
        }
      }
    }
  }
`

const toProduct = (p: any): Product => {
  const mappedProduct: Product = {
    id: p.id,
    handle: p.handle,
    title: p.title,
    image: p.featuredImage?.url ?? "",
    pricePerKg: Number.parseFloat(p.priceRange?.minVariantPrice?.amount ?? "0"),
    tags: p.tags ?? [],
    productType: p.productType ?? "",
    vendor: p.vendor ?? "",
    description: "",
    images: p.featuredImage?.url ? [p.featuredImage.url] : [],
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
    } catch (error) {
      console.error("Failed to parse price_per_kg metafield:", error)
    }
  }

  return mappedProduct
}

async function fetchAllProducts(): Promise<Product[]> {
  let allProducts: Product[] = []
  let hasNextPage = true
  let cursor: string | null = null

  while (hasNextPage) {
    const data = await shopifyFetch<any>(ALL_PRODUCTS_QUERY, {
      first: 250,
      after: cursor,
    })

    const products = data?.products
    if (!products) break

    const pageProducts = (products.edges ?? []).map((e: any) => toProduct(e.node))
    allProducts = [...allProducts, ...pageProducts]

    hasNextPage = products.pageInfo?.hasNextPage ?? false
    cursor = products.pageInfo?.endCursor ?? null
  }

  return allProducts
}

function getInitialFiltersFromUrl(searchParams: { [key: string]: string | string[] | undefined }): FilterState {
  const filters: FilterState = {
    meatType: [],
    cutFamily: [],
    occasion: [],
    department: [],
    deliType: [],
    spiceFamily: [],
    braaiGearFamily: [],
    groceryFamily: [],
    bulkType: [],
  }

  const parseFilterValue = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    return value.includes(",") ? value.split(",").map((v) => v.trim()) : [value]
  }

  if (searchParams.meat_type) {
    filters.meatType = parseFilterValue(searchParams.meat_type)
  }

  if (searchParams.cut_family) {
    filters.cutFamily = parseFilterValue(searchParams.cut_family)
  }

  if (searchParams.occasion) {
    filters.occasion = parseFilterValue(searchParams.occasion)
  }

  if (searchParams.department) {
    filters.department = parseFilterValue(searchParams.department)
  }

  if (searchParams.deli_type) {
    filters.deliType = parseFilterValue(searchParams.deli_type)
  }

  if (searchParams.spice_family) {
    filters.spiceFamily = parseFilterValue(searchParams.spice_family)
  }

  if (searchParams.braai_gear_family) {
    filters.braaiGearFamily = parseFilterValue(searchParams.braai_gear_family)
  }

  if (searchParams.grocery_family) {
    filters.groceryFamily = parseFilterValue(searchParams.grocery_family)
  }

  if (searchParams.bulk_type) {
    filters.bulkType = parseFilterValue(searchParams.bulk_type)
  }

  return filters
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const products = await fetchAllProducts()
  const initialFilters = getInitialFiltersFromUrl(searchParams)

  return (
    <>
      <Header />
      <SearchPageClient query={query} products={products} initialFilters={initialFilters} />
      <Footer />
    </>
  )
}
