import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductDetails } from "@/components/product-details"
import { SuggestedAddOns } from "@/components/suggested-add-ons"
import { ProductBreadcrumb } from "@/components/product-breadcrumb"
import { notFound } from "next/navigation"
import { shopifyFetch } from "@/lib/shopify"
import { PRODUCT_BY_HANDLE, PRODUCTS_BY_TAGS } from "@/lib/queries"
import { mapShopifyProductToProduct } from "@/lib/map"
import type { Metadata } from "next"

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

export async function generateMetadata(props: { params: { handle: string } }): Promise<Metadata> {
  const { handle } = props.params
  const shopifyProduct = await productByHandle(handle)

  if (!shopifyProduct) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    }
  }

  const product = mapShopifyProductToProduct(shopifyProduct)
  const price = product.variants[0]?.price?.amount
  const imageUrl = product.images[0]?.url

  return {
    title: `${product.title}`,
    description: product.descriptionHtml
      ? product.descriptionHtml.replace(/<[^>]*>/g, "").substring(0, 160)
      : `Shop ${product.title} at Hokaai Meat Market. Premium quality meats with local delivery in Gauteng.`,
    openGraph: {
      title: `${product.title} | Hokaai Meat Market`,
      description: product.descriptionHtml
        ? product.descriptionHtml.replace(/<[^>]*>/g, "").substring(0, 160)
        : `Shop ${product.title} at Hokaai Meat Market.`,
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800, alt: product.title }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Hokaai Meat Market`,
      description: product.descriptionHtml
        ? product.descriptionHtml.replace(/<[^>]*>/g, "").substring(0, 160)
        : `Shop ${product.title} at Hokaai Meat Market.`,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function ProductPage(props: { params: { handle: string } }) {
  const { handle } = props.params
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
              <h4 className="font-semibold text-brand-primary mb-2">Free Delivery</h4>
              <p className="text-slate-700">
                Free delivery within 5 km of Hokaai (Faerie Glen). Orders over R1 000 delivered free in Pretoria &
                Centurion. All other deliveries are charged at R5 per km, confirmed with you after checkout.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-primary mb-2">Fresh Guarantee</h4>
              <p className="text-slate-700">All meat is cut fresh to order and delivered within 24 hours.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export const revalidate = 60
