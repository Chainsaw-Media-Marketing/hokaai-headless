export interface Product {
  id: string
  title: string
  handle: string
  image: string | null
  pricePerKg: number
  tags: string[]
  description?: string
  images?: string[]
  inStock?: boolean
  meat_type?: string
  cut_family?: string
  occasion?: string[]
  department?: string
  bulk_type?: string
  deli_type?: string
  spice_family?: string
  braai_gear_family?: string
  grocery_family?: string
  variants?: ShopifyVariant[]
  minVariantPrice?: number
  price_per_kg?: number // Added price_per_kg metafield from Shopify
  descriptionHtml?: string // Rich HTML description from Shopify
  seo?: {
    title?: string
    description?: string
  }
  vendor?: string
  productType?: string
  availableForSale?: boolean
  totalInventory?: number
}

export interface ShopifyVariant {
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

export type ProductVariant = ShopifyVariant

export interface Collection {
  id: string
  title: string
  handle: string
  description?: string
  image?: string
  products?: Product[]
}

export interface CartItem {
  id: string
  productId: string
  productHandle: string // Added productHandle for navigation back to product page
  title: string
  image: string | null
  pricePerKg: number
  weight: number
  quantity: number
  lineTotal: number
  variantWeightGrams?: number // Variant weight from Shopify in grams
  price_per_kg?: number // Price per kg metafield from Shopify
  variantPrice?: number // Variant price for fixed-price items (without price_per_kg)
  variantId?: string // Shopify variant ID for checkout integration
  attributes?: Array<{ key: string; value: string }> // Added attributes field for cart line item attributes (e.g., household_size)
}

export interface Review {
  id: string
  name: string
  rating: number
  text: string
  date?: string
}

export interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
}

export interface OccasionTag {
  id: string
  title: string
  handle: string
  image: string
}

export interface MegaMenuProps {
  items: NavItem[]
  title: string
  onClose: () => void
  beefProducts?: MenuProduct[]
  lambProducts?: MenuProduct[]
  porkProducts?: MenuProduct[]
  chickenProducts?: MenuProduct[]
  biltongProducts?: MenuProduct[]
  droeworsProducts?: MenuProduct[]
  sticksProducts?: MenuProduct[]
  thinSticksProducts?: MenuProduct[]
  baconBiltongProducts?: MenuProduct[]
  otherDeliProducts?: MenuProduct[]
}

export interface MenuProduct {
  id: string
  title: string
  handle: string
  imageUrl: string
  imageAlt: string
}

export interface AddLineInput {
  variantId: string
  quantity: number
  attributes?: Array<{ key: string; value: string }>
}

export interface AddToCartInput {
  lines: AddLineInput[]
}

export interface ServerCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      id: string
      title: string
      handle: string
      featuredImage?: {
        url: string
      }
    }
    price: {
      amount: string
    }
    weight?: number
    weightUnit?: string
  }
  attributes?: Array<{ key: string; value: string }>
  cost: {
    totalAmount: {
      amount: string
    }
  }
}

export interface ServerCart {
  id: string
  checkoutUrl: string
  lines?: {
    edges: Array<{
      node: ServerCartLine
    }>
  }
  cost?: {
    totalAmount: {
      amount: string
    }
  }
}

export interface HydratedCart {
  items: CartItem[]
  itemCount: number
  total: number
  cartId: string
  checkoutUrl: string
}
