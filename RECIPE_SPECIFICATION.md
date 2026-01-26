# Hokaai Recipe System — Complete Specification

**Analysis Date:** January 2026  
**Purpose:** Define exactly what is required to add a new recipe without breaking existing functionality.

---

## 1. System Architecture Overview

Recipes in the Hokaai codebase are **statically defined pages** — NOT dynamic routes. Each recipe requires:

| Component | Location | Purpose |
|-----------|----------|---------|
| Recipe Detail Page | `app/recipes/{slug}/page.tsx` | The full recipe page with hero, content, and sidebar |
| Stocked Items File | `app/recipes/{slug}/stocked-items.ts` | Product handles for "Shop these ingredients" |
| Listing Card Entry | `app/recipes/page.tsx` | Card in the `/recipes` listing grid |

**Important:** There is NO single source of truth. The listing page (`app/recipes/page.tsx`) and detail page (`app/recipes/{slug}/page.tsx`) each contain their own metadata that MUST be kept in sync manually.

---

## 2. Data Model Analysis

### 2.1 Listing Page Card Data (in `app/recipes/page.tsx`)

```typescript
{
  slug: string           // URL path segment (e.g., "ribeye-garlic-butter")
  title: string          // Display title for card
  blurb: string          // 1-2 sentence description for card
  occasion: string       // Tag shown on card (e.g., "Braai", "Roast", "Weeknight", "Stew", "Potjie")
  time: string           // Cook time badge (e.g., "30 min", "2 h", "3½ h")
  serves: string         // Serving size badge (e.g., "4", "4–6", "6")
  image: string          // Hero image URL (Vercel blob storage URL)
}
```

### 2.2 Detail Page Data (in `app/recipes/{slug}/page.tsx`)

```typescript
const recipeData = {
  title: string          // MUST match listing title exactly
  occasion: string       // MUST match listing occasion exactly
  time: string           // MUST match listing time exactly
  serves: string         // MUST match listing serves exactly
}
```

### 2.3 Stocked Items Data (in `app/recipes/{slug}/stocked-items.ts`)

```typescript
export const STOCKED_ITEMS = [
  {
    handle: string       // Shopify product handle (EXACT match required)
    qty: number          // Quantity to add to cart
    unit?: string        // Display unit (e.g., "× 200 g", "bottle", "jar")
    note?: string        // Optional display note (rarely used)
  }
]
```

---

## 3. Category System

Categories are defined as **sections** in the listing page array:

| Section Title | Occasion Values Used | Description |
|--------------|---------------------|-------------|
| "Braai" | "Braai" | Grilled/BBQ recipes |
| "Roasts" | "Roast" | Oven-roasted dishes |
| "Weeknight Quick & Easy" | "Weeknight" | Fast weekday meals |
| "Stew / Potjie" | "Stew" or "Potjie" | Slow-cooked dishes |

**To add a recipe to a category:** Add the recipe object to the appropriate `section.recipes[]` array in `app/recipes/page.tsx`.

---

## 4. "Shop These Ingredients" System

### 4.1 How It Works

1. `ShopIngredients` component receives `items` (from `stocked-items.ts`) and `recipeSlug`
2. Component calls `getRecipeProducts(handles)` server action on mount
3. Server action fetches products from Shopify Storefront API by handle
4. Products are displayed with checkboxes, prices, and variant selectors
5. "Add Selected" / "Add All" buttons call `addToCartAndHydrate()` with batch lines

### 4.2 Product Handle Requirements

- **MUST be exact Shopify product handle** (case-sensitive, hyphenated)
- Products must exist and be published in Shopify
- Products should have at least one available variant

### 4.3 What Products Should Be Linked

| Link | Don't Link |
|------|-----------|
| Primary meat/protein (Hokaai products) | Generic pantry items (butter, oil, salt) |
| Branded spices/seasonings sold by Hokaai | Fresh vegetables/herbs |
| Marinades/sauces sold by Hokaai | Items not in Hokaai catalog |

**Rule:** Only link products that exist in the Hokaai Shopify store and are core to the recipe.

---

## 5. Required Files Checklist

To add a new recipe, you MUST create/update these files:

### 5.1 Create: `app/recipes/{slug}/page.tsx`

- Full recipe detail page
- Contains: hero image, breadcrumbs, metadata badges, ingredients list, method steps, notes section
- Imports and renders `ShopIngredients` component
- Uses "use client" directive

### 5.2 Create: `app/recipes/{slug}/stocked-items.ts`

- Exports `STOCKED_ITEMS` array
- Contains product handles for shoppable ingredients

### 5.3 Update: `app/recipes/page.tsx`

- Add recipe card object to appropriate section's `recipes[]` array
- Metadata MUST match detail page exactly

---

## 6. Content Structure (Detail Page)

### 6.1 Required Sections

| Section | Element | Content |
|---------|---------|---------|
| Hero Image | `<img>` | Full-width recipe photo (blob URL) |
| Breadcrumbs | Text links | "Recipes / {occasion} / {title}" |
| Title | `<h1>` | Recipe name |
| Metadata Badges | Spans | Occasion, Time, Serves |
| Description | `<p>` | 1-2 sentence intro |
| Ingredients | `<ul>` | Bulleted list with quantities |
| Method | `<ol>` | Numbered steps with bold labels |
| Notes | `<ul>` | Optional tips/variations |
| Shop Sidebar | Component | `<ShopIngredients items={STOCKED_ITEMS} recipeSlug="{slug}" />` |

### 6.2 Method Step Format

```html
<li>
  <strong>Step Label:</strong> Instructions with <strong>key temps/times</strong> highlighted.
</li>
```

---

## 7. Reusable Recipe Template

### 7.1 Template: `stocked-items.ts`

```typescript
// app/recipes/{RECIPE_SLUG}/stocked-items.ts

export const STOCKED_ITEMS = [
  // Primary meat/protein
  { handle: "{SHOPIFY_HANDLE}", qty: 1, unit: "{DISPLAY_UNIT}" },
  
  // Spices/seasonings (Hokaai products only)
  { handle: "{SHOPIFY_HANDLE}", qty: 1, unit: "bottle" },
  
  // Add more as needed...
]
```

### 7.2 Template: `page.tsx`

```tsx
// app/recipes/{RECIPE_SLUG}/page.tsx
"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShopIngredients } from "@/components/recipes/ShopIngredients"
import { CopyLink } from "@/components/ui/CopyLink"
import { STOCKED_ITEMS } from "./stocked-items"
import Link from "next/link"
import { useEffect } from "react"

export default function {COMPONENT_NAME}Page() {
  // ============================================
  // RECIPE METADATA — Must match listing card exactly
  // ============================================
  const recipeData = {
    title: "{RECIPE_TITLE}",                    // e.g., "Ribeye Steak with Garlic Butter & Braai Spice"
    occasion: "{OCCASION}",                      // e.g., "Braai" | "Roast" | "Weeknight" | "Stew" | "Potjie"
    time: "{COOK_TIME}",                         // e.g., "30 min" | "1 h" | "2½ h"
    serves: "{SERVES}",                          // e.g., "4" | "4–6" | "6"
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen">
      <div className="print-only-header">
        <img src="/images/hokaai-logo.png" alt="Hokaai" className="print-logo" />
        <p className="print-url">{typeof window !== "undefined" ? window.location.href : ""}</p>
      </div>

      <Header />

      <main>
        {/* Hero Header */}
        <section className="container mx-auto px-6 lg:px-8 pt-8">
          <div className="mb-6 rounded-2xl overflow-hidden">
            <img
              src="{HERO_IMAGE_URL}"
              alt="{RECIPE_TITLE}"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>
          <div className="mb-6 md:mb-8 rounded-2xl overflow-hidden relative bg-gradient-to-br from-[var(--color-brand-primary-dark)] to-transparent">
            <div className="container px-4 md:px-6 py-8 md:py-12">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="text-xs text-foreground/70">
                  <Link href="/recipes" className="hover:text-[var(--color-brand-red)] transition-colors">
                    Recipes
                  </Link>
                  {" / "}
                  <span>{recipeData.occasion}</span>
                  {" / "}
                  <span className="text-foreground/90">{recipeData.title}</span>
                </div>
                <div className="flex gap-2">
                  <CopyLink />
                  <button
                    onClick={() => window.print()}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border/40 hover:border-[var(--color-brand-red)] transition-colors"
                    title="Print recipe"
                  >
                    Print
                  </button>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-brand-primary mb-4">{recipeData.title}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border/60 px-3 py-1.5 text-sm text-foreground/80 bg-white/5">
                  {recipeData.occasion}
                </span>
                <span className="inline-flex items-center rounded-full border border-border/60 px-3 py-1.5 text-sm text-foreground/80 bg-white/5">
                  {recipeData.time}
                </span>
                <span className="inline-flex items-center rounded-full border border-border/60 px-3 py-1.5 text-sm text-foreground/80 bg-white/5">
                  Serves {recipeData.serves}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Recipe Content */}
              <div className="lg:col-span-8">
                {/* Description */}
                <p className="text-foreground/90 text-lg mb-8 leading-relaxed">
                  {RECIPE_DESCRIPTION}
                </p>

                {/* Ingredients */}
                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Ingredients
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/90">
                    {/* List all ingredients with quantities */}
                    <li>{INGREDIENT_1}</li>
                    <li>{INGREDIENT_2}</li>
                    {/* ... */}
                  </ul>
                </div>

                {/* Method */}
                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Method
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ol className="list-decimal pl-6 mt-4 space-y-3 text-foreground/90">
                    <li>
                      <strong>{STEP_1_LABEL}:</strong> {STEP_1_INSTRUCTIONS}
                    </li>
                    <li>
                      <strong>{STEP_2_LABEL}:</strong> {STEP_2_INSTRUCTIONS}
                    </li>
                    {/* ... */}
                  </ol>
                </div>

                {/* Notes (Optional) */}
                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Notes
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/90">
                    <li>{NOTE_1}</li>
                    <li>{NOTE_2}</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-4">
                <div className="self-start rounded-2xl border border-border/40 bg-white/5 shadow-md p-5">
                  <ShopIngredients items={STOCKED_ITEMS} recipeSlug="{RECIPE_SLUG}" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
```

### 7.3 Template: Listing Card Entry (add to `app/recipes/page.tsx`)

```typescript
{
  slug: "{RECIPE_SLUG}",                         // Must match folder name
  title: "{RECIPE_TITLE}",                       // Must match detail page
  blurb: "{CARD_BLURB}",                         // 1-2 sentence description
  occasion: "{OCCASION}",                        // Must match detail page
  time: "{COOK_TIME}",                           // Must match detail page
  serves: "{SERVES}",                            // Must match detail page
  image: "{HERO_IMAGE_URL}",                     // Same as detail page hero
}
```

---

## 8. Validation Checklist

Before considering a recipe "complete," verify:

- [ ] Folder created: `app/recipes/{slug}/`
- [ ] `page.tsx` created with all sections
- [ ] `stocked-items.ts` created with valid Shopify handles
- [ ] Card added to correct section in `app/recipes/page.tsx`
- [ ] `slug` matches folder name exactly
- [ ] `title` identical in listing and detail page
- [ ] `occasion` identical in listing and detail page
- [ ] `time` identical in listing and detail page
- [ ] `serves` identical in listing and detail page
- [ ] `image` URL valid (Vercel blob storage)
- [ ] All product handles exist in Shopify
- [ ] Recipe renders correctly at `/recipes/{slug}`
- [ ] Recipe appears in listing at `/recipes`
- [ ] "Shop these ingredients" loads products
- [ ] "Add Selected" / "Add All" buttons work

---

## 9. Common Pitfalls

| Issue | Cause | Solution |
|-------|-------|----------|
| Recipe not in listing | Card not added to `page.tsx` | Add to correct section array |
| "Shop ingredients" empty | Invalid product handles | Verify handles in Shopify admin |
| Metadata mismatch | Listing vs detail out of sync | Copy values exactly between files |
| Hero image 404 | Blob URL expired/wrong | Upload new image, get fresh URL |
| Cart button fails | Product unavailable | Check Shopify inventory status |

---

## 10. Adding a New Recipe — Quick Steps

1. **Get hero image URL** — Upload to Vercel blob storage, copy URL
2. **Get product handles** — Find exact handles in Shopify admin
3. **Create folder** — `app/recipes/{slug}/`
4. **Create `stocked-items.ts`** — Export STOCKED_ITEMS array
5. **Create `page.tsx`** — Use template, fill in all placeholders
6. **Update listing** — Add card to correct section in `app/recipes/page.tsx`
7. **Test** — Visit `/recipes/{slug}` and verify all functionality

---

*This specification matches the current implementation exactly. No assumptions were made about new functionality.*
