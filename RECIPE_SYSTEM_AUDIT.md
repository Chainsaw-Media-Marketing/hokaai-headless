# Recipe System Audit - Hokaai Meat Market

**Audit Date:** January 2026  
**Auditor:** v0  
**Status:** Documentation only - NO code changes made

---

## A) Recipe Architecture Map

### Recipe Routes

| Route Pattern | File Path | Type |
|---------------|-----------|------|
| `/recipes` | `app/recipes/page.tsx` | Index page (lists all recipes) |
| `/recipes/ribeye-garlic-butter` | `app/recipes/ribeye-garlic-butter/page.tsx` | Individual recipe |
| `/recipes/picanha-garlic-herb` | `app/recipes/picanha-garlic-herb/page.tsx` | Individual recipe |
| `/recipes/brisket-brown-onion-gravy` | `app/recipes/brisket-brown-onion-gravy/page.tsx` | Individual recipe |
| `/recipes/chicken-star-pack-tray-roast` | `app/recipes/chicken-star-pack-tray-roast/page.tsx` | Individual recipe |
| `/recipes/beef-stirfry-garlic-veggie` | `app/recipes/beef-stirfry-garlic-veggie/page.tsx` | Individual recipe |
| `/recipes/creamy-chicken-fillet-pasta` | `app/recipes/creamy-chicken-fillet-pasta/page.tsx` | Individual recipe |
| `/recipes/oxtail-potjie-worcester` | `app/recipes/oxtail-potjie-worcester/page.tsx` | Individual recipe |
| `/recipes/beef-goulash-red-wine-garlic` | `app/recipes/beef-goulash-red-wine-garlic/page.tsx` | Individual recipe |

### Slug Resolution

**NOT dynamic routes.** Each recipe is a **statically-defined folder** with its own `page.tsx`. There is no `[slug]` dynamic route pattern.

```
app/recipes/
├── page.tsx                          # Index page
├── ribeye-garlic-butter/
│   ├── page.tsx                      # Recipe page component
│   └── stocked-items.ts              # Product mappings
├── picanha-garlic-herb/
│   ├── page.tsx
│   └── stocked-items.ts
└── ... (other recipes)
```

### Where Recipe Content Lives

**HARDCODED IN CODE** - Two separate systems exist:

1. **Active System (Individual page files):**
   - Each recipe page (`app/recipes/[recipe-slug]/page.tsx`) contains its own content inline
   - Recipe metadata (title, occasion, time, serves) defined in component
   - Ingredients list, method steps, and notes hardcoded in JSX

2. **Legacy/Unused System:**
   - File: `lib/recipes-data.ts`
   - Contains a `recipes` array with `Recipe` interface
   - **NOT actively used** by individual recipe pages
   - May be used elsewhere (e.g., search, sitemap)

**Evidence from `app/recipes/ribeye-garlic-butter/page.tsx`:**
```tsx
const recipeData = {
  title: "Ribeye Steak with Garlic Butter & Braai Spice",
  occasion: "Braai",
  time: "30 min",
  serves: "4",
}
// Content is inline JSX, NOT from external data source
```

### Where Recipe Images Come From

**Mixed sources:**
- Hero images: Vercel Blob storage (`hebbkx1anhila5yf.public.blob.vercel-storage.com`)
- Fallbacks: Local `/public/` directory
- NOT from Shopify

**Example:**
```tsx
src="/images/ribeye-20steak-20with-20garlic-20butter-20-26-20braai-20spice.png"
```

---

## B) Recipe Product Mappings

### Location

Each recipe has a co-located `stocked-items.ts` file:

| Recipe | Product Mapping File |
|--------|---------------------|
| ribeye-garlic-butter | `app/recipes/ribeye-garlic-butter/stocked-items.ts` |
| picanha-garlic-herb | `app/recipes/picanha-garlic-herb/stocked-items.ts` |
| brisket-brown-onion-gravy | `app/recipes/brisket-brown-onion-gravy/stocked-items.ts` |
| ... | ... |

### Data Structure

**Interface (from `components/recipes/ShopIngredients.tsx`):**
```typescript
interface StockedItem {
  handle: string    // Shopify product handle (NOT productId, NOT variantId)
  qty: number       // Quantity to add to cart
  unit?: string     // Display unit (e.g., "× 200 g", "jar", "bottle")
  note?: string     // Optional note for display
}
```

### Example: `app/recipes/ribeye-garlic-butter/stocked-items.ts`

```typescript
export const STOCKED_ITEMS = [
  { handle: "beef-ribeye-steak", qty: 4, unit: "× 200 g", note: "Ribeye steaks" },
  { handle: "marina-original-braai-salt-400g", qty: 1, unit: "jar" },
  { handle: "ina-paarman-meat-spice-200ml", qty: 1, unit: "bottle" },
]
```

### Product Identifier Used

| Field | Value | Used? |
|-------|-------|-------|
| `handle` | Shopify product handle | **YES** (primary identifier) |
| `productId` | Shopify GID | NO |
| `variantId` | Shopify variant GID | NO (resolved at fetch time) |
| `SKU` | Product SKU | NO |

### How Quantity is Stored

**Quantity is stored per ingredient line** via the `qty` field.

- `qty: 4` means "add 4 of this product to cart"
- NOT derived from servings
- NOT tied to variant weight
- Explicitly defined per product per recipe

---

## C) How Product Data is Fetched

### Fetch Flow

```
Recipe Page Loads
       ↓
ShopIngredients component mounts
       ↓
useEffect calls getRecipeProducts(handles)
       ↓
Server Action: app/actions/get-recipe-products.ts
       ↓
shopifyFetch() from lib/shopify.ts
       ↓
Shopify Storefront API GraphQL
       ↓
Returns Product[] with variants
```

### Fetcher Function

**File:** `lib/shopify.ts`

```typescript
export async function shopifyFetch<T>(query: string, variables?: Record<string, any>, retries = 3): Promise<T>
```

- Endpoint: `https://hfzgry-kp.myshopify.com/api/2024-01/graphql.json`
- Auth: `X-Shopify-Storefront-Access-Token` header
- Caching: `next: { revalidate: 60 }` (60 second ISR)

### Server Action

**File:** `app/actions/get-recipe-products.ts`

```typescript
export async function getRecipeProducts(handles: string[]): Promise<Product[]>
```

Builds a dynamic GraphQL query using aliases:
```graphql
query {
  product0: productByHandle(handle: "beef-ribeye-steak") { ...fields }
  product1: productByHandle(handle: "marina-original-braai-salt-400g") { ...fields }
  product2: productByHandle(handle: "ina-paarman-meat-spice-200ml") { ...fields }
}
```

### Fields Returned

```graphql
id
handle
title
featuredImage { url, altText }
priceRange { minVariantPrice { amount, currencyCode } }
variants(first: 10) {
  edges {
    node {
      id
      title
      availableForSale
      priceV2 { amount, currencyCode }
      weight
      weightUnit
    }
  }
}
# Plus metafields: meatType, cutFamily, occasion, department, etc.
```

### Caching/Revalidation

- `lib/shopify.ts`: `next: { revalidate: 60 }` (60 seconds)
- Recipe pages are client components (`"use client"`) so product fetching happens on each page load

---

## D) Add to Cart Flow from Recipe Page

### Complete Trace

```
User clicks "Add Selected" or "Add All" button
       ↓
ShopIngredients.handleAddToCart(selectedOnly: boolean)
       ↓
Build lines array with { variantId, quantity }
       ↓
addToCartAndHydrate({ lines }) from lib/cart-actions.ts
       ↓
POST /api/shopify/cart/add (with cartId from localStorage if exists)
       ↓
app/api/shopify/cart/add/route.ts
       ↓
addLinesToCart() or createCartWithLines() from server/shopify.ts
       ↓
Shopify Storefront API: cartLinesAdd mutation
       ↓
Response mapped via mapShopifyCartToSummary()
       ↓
Client receives CartHydratePayload
       ↓
localStorage updated (cartId, checkoutUrl)
       ↓
CustomEvent "cart:hydrate" dispatched
       ↓
CartProvider reducer handles HYDRATE_FROM_SERVER
       ↓
Cart drawer opens (isOpen: true)
```

### Answers to Specific Questions

#### 1) Where is cart state stored?

**React Context + localStorage**

- **Primary state:** `CartProvider` in `lib/cart-context.tsx` using `useReducer`
- **Persistence:** `localStorage` keys:
  - `hk_shopify_cart_id` - Shopify cart GID
  - `hk_shopify_checkout_url` - Shopify checkout URL
- **Server sync:** All cart operations sync with Shopify Storefront API

#### 2) How is cart ID persisted and rehydrated?

**Persistence:**
```typescript
// lib/cart-actions.ts
window.localStorage.setItem("hk_shopify_cart_id", payload.cartId)
```

**Rehydration (on page load):**
```typescript
// lib/cart-context.tsx - CartProvider useEffect
const savedCartId = window.localStorage.getItem("hk_shopify_cart_id")
if (savedCartId) {
  fetch("/api/shopify/cart/get", { body: JSON.stringify({ cartId: savedCartId }) })
  // Then dispatch HYDRATE_FROM_SERVER
}
```

Also calls `bootstrapCartOnLoad()` from `lib/cart-actions.ts` on mount.

#### 3) What payload is sent on add?

**To `/api/shopify/cart/add`:**
```typescript
{
  cartId: string | undefined,  // From localStorage, may be undefined
  lines: Array<{
    variantId: string,         // Shopify variant GID
    quantity: number           // From stocked-items.ts qty field
  }>
}
```

**No `sellingPlanId`** is sent (subscriptions not implemented for recipes).

#### 4) Does it add MULTIPLE items at once or one-by-one?

**MULTIPLE items at once (batch add)**

From `components/recipes/ShopIngredients.tsx`:
```typescript
const lines = productsToAdd.map((product) => {
  const variant = product.variants?.find((v) => v.availableForSale)
  const stockedItem = items.find((item) => item.handle === product.handle)
  const recipeQuantity = stockedItem?.qty || 1
  return { variantId: variant.id, quantity: recipeQuantity }
}).filter(Boolean)

// Single API call for all items
await addToCartAndHydrate({ lines })
```

The API route (`/api/shopify/cart/add`) handles the array and makes ONE Shopify mutation.

#### 5) How does it enforce "default quantity per recipe ingredient"?

**From the `stocked-items.ts` file:**

```typescript
// stocked-items.ts
export const STOCKED_ITEMS = [
  { handle: "beef-ribeye-steak", qty: 4, ... },  // qty = 4
]

// ShopIngredients.tsx
const stockedItem = items.find((item) => item.handle === product.handle)
const recipeQuantity = stockedItem?.qty || 1  // Uses qty from stocked-items.ts

return {
  variantId: variant.id,
  quantity: recipeQuantity,  // This is the enforced quantity
}
```

The `qty` field in `stocked-items.ts` is the source of truth for recipe quantities.

#### 6) What happens if a product has multiple variants—how is the correct variant chosen?

**First available variant wins:**

```typescript
// ShopIngredients.tsx
const variant = product.variants?.find((v) => v.availableForSale)
```

**Also in RecipeProductCard.tsx:**
```typescript
const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(() => {
  if (!product.variants || product.variants.length === 0) return null
  return product.variants.find((v) => v.availableForSale) || product.variants[0]
})
```

**IMPORTANT:** The variant selector in `RecipeProductCard` allows users to change variants, BUT the current implementation in `ShopIngredients.handleAddToCart` does NOT read the user's selection. It always picks the first available variant.

This is a potential bug or intentional simplification.

#### 7) What UI updates after add?

1. **Button state:** `isAdding = true` shows "Adding..." text
2. **Toast notification:** Via `showToast()` custom event
3. **Cart drawer opens:** `HYDRATE_FROM_SERVER` sets `isOpen: true` when items > 0
4. **Cart count updates:** `itemCount` and `lineCount` recalculated from payload

---

## E) Safety Rules: What We Can Change vs What Breaks Things

### SAFE to Edit

| Item | Location | Notes |
|------|----------|-------|
| Recipe title | `app/recipes/[slug]/page.tsx` (recipeData.title) | Display only |
| Recipe occasion/time/serves | `app/recipes/[slug]/page.tsx` (recipeData) | Display only |
| Hero image URL | `app/recipes/[slug]/page.tsx` (img src) | Must be valid URL |
| Ingredients list text | `app/recipes/[slug]/page.tsx` (ul.list-disc) | Display only |
| Method steps text | `app/recipes/[slug]/page.tsx` (ol.list-decimal) | Display only |
| Notes/tips text | `app/recipes/[slug]/page.tsx` | Display only |
| Product note/unit display | `stocked-items.ts` (unit, note fields) | Display only |
| Index page sections | `app/recipes/page.tsx` (sections array) | Must match slugs |

### DANGEROUS - Do Not Modify Without Testing

| Item | Location | Impact |
|------|----------|--------|
| Product handle | `stocked-items.ts` (handle field) | **BREAKS ADD TO CART** if handle doesn't exist in Shopify |
| Product qty | `stocked-items.ts` (qty field) | Changes quantity added to cart |
| STOCKED_ITEMS export name | `stocked-items.ts` | **BREAKS** - ShopIngredients imports by name |
| StockedItem interface | `components/recipes/ShopIngredients.tsx` | **BREAKS** all recipe pages |
| getRecipeProducts function | `app/actions/get-recipe-products.ts` | **BREAKS** product fetching |
| addToCartAndHydrate function | `lib/cart-actions.ts` | **BREAKS** all cart operations |
| CartProvider context | `lib/cart-context.tsx` | **BREAKS** entire cart system |
| /api/shopify/cart/* routes | `app/api/shopify/cart/*/route.ts` | **BREAKS** all cart operations |
| shopifyFetch/storefrontFetch | `lib/shopify.ts`, `server/shopify.ts` | **BREAKS** all Shopify data |
| mapShopifyCartToSummary | `lib/mapShopifyCartToSummary.ts` | **BREAKS** cart hydration |

---

## F) How to Add a NEW Recipe

### Step-by-Step Guide

#### 1. Create Recipe Folder

```bash
mkdir app/recipes/my-new-recipe
```

#### 2. Create `stocked-items.ts`

```typescript
// app/recipes/my-new-recipe/stocked-items.ts
export const STOCKED_ITEMS = [
  { handle: "existing-shopify-handle", qty: 2, unit: "packs" },
  { handle: "another-product-handle", qty: 1, unit: "bottle" },
]
```

**CRITICAL:** Handles must match exactly what's in Shopify. Verify at:
`https://hfzgry-kp.myshopify.com/admin/products` → each product has a handle in URL.

#### 3. Create `page.tsx`

Copy an existing recipe page as template:

```typescript
// app/recipes/my-new-recipe/page.tsx
"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShopIngredients } from "@/components/recipes/ShopIngredients"
import { CopyLink } from "@/components/ui/CopyLink"
import { STOCKED_ITEMS } from "./stocked-items"
import Link from "next/link"
import { useEffect } from "react"

export default function MyNewRecipePage() {
  const recipeData = {
    title: "My New Recipe Title",
    occasion: "Braai",       // Braai | Roasts | Quick & Easy | Stew/Potjie
    time: "30 min",
    serves: "4",
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen">
      {/* ... copy structure from existing recipe ... */}
      
      {/* IMPORTANT: Pass STOCKED_ITEMS and unique recipeSlug */}
      <ShopIngredients items={STOCKED_ITEMS} recipeSlug="my-new-recipe" />
    </div>
  )
}
```

#### 4. Add to Index Page

Edit `app/recipes/page.tsx` to include in appropriate section:

```typescript
const sections = [
  {
    title: "Braai",
    recipes: [
      // ... existing recipes ...
      {
        slug: "my-new-recipe",
        title: "My New Recipe Title",
        blurb: "Short description for card.",
        occasion: "Braai",
        time: "30 min",
        serves: "4",
        image: "https://your-image-url.png",
      },
    ],
  },
]
```

#### 5. Add to Sitemap (Optional)

Edit `app/sitemap.ts` to include `/recipes/my-new-recipe`.

### Validation Checklist

- [ ] **Page renders:** Visit `/recipes/my-new-recipe` - no errors
- [ ] **Products load:** "Shop these ingredients" shows products with images and prices
- [ ] **No "Loading products..." stuck:** Products should load within 2-3 seconds
- [ ] **"Add Selected" works:** Click button, toast appears, cart drawer opens
- [ ] **Correct quantities:** Check cart - quantities match `qty` values in stocked-items.ts
- [ ] **Cart persists after refresh:** Reload page, open cart drawer - items still there
- [ ] **No console errors:** Open DevTools, check for red errors
- [ ] **Index page links work:** Click recipe card on `/recipes` - navigates correctly
- [ ] **Breadcrumb correct:** Shows "Recipes / [Occasion] / [Title]"

### Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Loading products..." never stops | Invalid product handle | Check handles match Shopify exactly |
| Products show but no price | Shopify product has no variants | Add at least one variant in Shopify |
| "Add to Cart" does nothing | Variant not available for sale | Enable inventory in Shopify |
| Cart doesn't open | JS error in console | Check ShopIngredients props |
| Wrong quantity added | `qty` field incorrect | Update stocked-items.ts |

---

## Summary

The recipe system is **100% code-based** with no CMS integration. Each recipe is a static folder containing:
1. `page.tsx` - Recipe content and layout
2. `stocked-items.ts` - Product handles and quantities

Products are fetched from Shopify at runtime using handles, and cart operations use the standard Shopify Storefront API cart mutations.

**Key files to understand:**
- `components/recipes/ShopIngredients.tsx` - Main "shop ingredients" component
- `app/actions/get-recipe-products.ts` - Product fetching server action
- `lib/cart-actions.ts` - Cart add/hydrate functions
- `server/shopify.ts` - Shopify API mutations
