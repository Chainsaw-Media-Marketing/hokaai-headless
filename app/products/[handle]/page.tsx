import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductDetails } from "@/components/product-details"
import { SuggestedAddOns } from "@/components/suggested-add-ons"
import { ProductBreadcrumb } from "@/components/product-breadcrumb"
import Link from "next/link"
import { notFound } from "next/navigation"
import { shopifyFetch } from "@/lib/shopify"
import { PRODUCT_BY_HANDLE, PRODUCTS_BY_TAGS } from "@/lib/queries"
import { mapShopifyProductToProduct } from "@/lib/map"

interface ShopifyProductResponse {
  product: {
    id: string
    title: string
    handle: string
    descriptionHtml: string
    images: {
      edges: Array<{
        node: {
          url: string
          altText: string | null
          width: number
          height: number
        }
      }>
    }
    variants: {
      edges: Array<{
        node: {
          id: string
          title: string
          availableForSale: boolean
          price: {
            amount: string
            currencyCode: string
          }
        }
      }>
    }
    meatType: { value: string } | null
    cutFamily: { value: string } | null
    occasion: { value: string } | null
  } | null
}

interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: {
        id: string
        title: string
        handle: string
        featuredImage: {
          url: string
          altText: string | null
        } | null
        priceRange: {
          minVariantPrice: {
            amount: string
            currencyCode: string
          }
        }
        variants: {
          edges: Array<{
            node: {
              id: string
              title: string
              availableForSale: boolean
              price: {
                amount: string
                currencyCode: string
              }
              compareAtPrice: {
                amount: string
                currencyCode: string
              } | null
              weight: number | null
              weightUnit: string | null
              sku: string | null
            }
          }>
        }
        tags: string[]
        meatType: { value: string } | null
        cutFamily: { value: string } | null
        occasion: { value: string } | null
        department: { value: string } | null
        deliType: { value: string } | null
        bulkType: { value: string } | null
        pricePerKg: { value: string } | null
        spiceFamily: { value: string } | null
        braaiGearFamily: { value: string } | null
        groceryFamily: { value: string } | null
      }
    }>
  }
}

async function productByHandle(handle: string) {
  const data = await shopifyFetch<ShopifyProductResponse>(PRODUCT_BY_HANDLE, { handle })
  return data.product
}

async function getSuggestedProducts() {
  try {
    const data = await shopifyFetch<ShopifyProductsResponse>(PRODUCTS_BY_TAGS, {
      query: "*", // Fetch all products
      first: 30, // Fetch more to ensure we get enough spices/sauces
    })

    const filteredProducts = data.products.edges.filter(({ node }) => {
      const departmentValue = node.department?.value
      if (!departmentValue) return false

      try {
        const departments = JSON.parse(departmentValue)
        const hasSpicesOrSauces = departments.some(
          (dept: string) => dept === "spices-rubs" || dept === "sauces-marinades",
        )
        return hasSpicesOrSauces
      } catch (e) {
        return false
      }
    })

    const limitedProducts = filteredProducts.slice(0, 3)

    return limitedProducts.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.featuredImage?.url || "/placeholder.svg",
      pricePerKg: node.priceRange.minVariantPrice.amount
        ? Number.parseFloat(node.priceRange.minVariantPrice.amount)
        : 0,
      minVariantPrice: node.priceRange.minVariantPrice.amount
        ? Number.parseFloat(node.priceRange.minVariantPrice.amount)
        : 0,
      price_per_kg: node.pricePerKg?.value ? Number.parseFloat(node.pricePerKg.value) : undefined,
      tags: node.tags,
      department: node.department?.value || "",
      spice_family: node.spiceFamily?.value || undefined,
      braai_gear_family: node.braaiGearFamily?.value || undefined,
      variants: node.variants.edges.map(({ node: variant }) => ({
        id: variant.id,
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode,
        },
        compareAtPrice: variant.compareAtPrice,
        availableForSale: variant.availableForSale,
        weight: variant.weight,
        weightUnit: variant.weightUnit,
        sku: variant.sku,
      })),
    }))
  } catch (error) {
    console.error("[v0] Error fetching suggested products:", error)
    return []
  }
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const { handle } = await props.params
  const shopifyProduct = await productByHandle(handle)

  if (!shopifyProduct) {
    notFound()
  }

  const product = mapShopifyProductToProduct(shopifyProduct)

  const suggestedProducts = await getSuggestedProducts()

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <ProductBreadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <ProductGallery product={product} />

          {/* Product Details */}
          <ProductDetails product={product} />
        </div>

        {/* Suggested Add-ons */}
        {suggestedProducts.length > 0 && <SuggestedAddOns products={suggestedProducts} />}

        {/* Delivery Info */}
        <div className="bg-slate-50 rounded-2xl p-6 mt-12">
          <h3 className="font-heading font-semibold text-lg text-brand-primary mb-4">Delivery Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-brand-primary mb-2">Local Delivery</h4>
              <p className="text-slate-700">
                Free delivery on orders over R1 500 in selected Pretoria & Centurion postal codes. R50 flat-rate
                delivery applies to eligible local orders under R1 500.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-primary mb-2">Other Areas</h4>
              <p className="text-slate-700">
                Nationwide express courier delivery is available at a flat rate of R350. In-store collection is also
                available.
              </p>
            </div>
          </div>
          <Link
            href="/delivery-info"
            className="inline-block mt-4 font-semibold text-brand-primary underline underline-offset-4 hover:opacity-80"
          >
            View eligible postal codes and full delivery information
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export const revalidate = 60
