"use client"

// TEST NOTES: Recipe page renders with hero header, breadcrumbs, improved typography, grid layout, and sticky "Shop these ingredients" card (v1).

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShopIngredients } from "@/components/recipes/ShopIngredients"
import { CopyLink } from "@/components/ui/CopyLink"
import { STOCKED_ITEMS } from "./stocked-items"
import Link from "next/link"
import { useEffect } from "react"

export default function OxtailPotjieWorcesterPage() {
  const recipeData = {
    title: "Classic Oxtail Potjie with Worcester Braai Mix",
    occasion: "Potjie",
    time: "3½ h",
    serves: "6",
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen">
      <div className="print-only-header hidden">
        <img src="/images/hokaai-logo.png" alt="Hokaai" className="print-logo" />
        <p className="print-url">{typeof window !== "undefined" ? window.location.href : ""}</p>
      </div>

      <Header />

      <main>
        {/* Hero Header */}
        <section className="container mx-auto px-6 lg:px-8 pt-8">
          <div className="mb-6 rounded-2xl overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Classic%20Octail%20Potjie%20with%20Worcester%20Braai%20Mix-DNQ3pd6B30KCAkPx1vt9cEt0zNk9kM.png"
              alt="Classic Oxtail Potjie with Worcester Braai Mix"
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
                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Ingredients
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/90">
                    <li>2 × 500 g Hokaai Oxtail</li>
                    <li>2 tbsp Scalli's Worcester Braai Mix</li>
                    <li>2 tsp Ina Paarman Beef Stock Powder</li>
                    <li>2 onions, chopped</li>
                    <li>2 carrots, sliced</li>
                    <li>1 tin tomatoes</li>
                    <li>1 cup water or red wine</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Method
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ol className="list-decimal pl-6 mt-4 space-y-3 text-foreground/90">
                    <li>
                      <strong>Brown:</strong> Over medium-high heat, brown oxtail pieces in a little oil{" "}
                      <strong>in batches</strong> (deep colour = flavour).
                    </li>
                    <li>
                      <strong>Aromatics:</strong> Add onions + carrots; cook <strong>6–8 min</strong>. Stir in Worcester
                      Braai Mix + Beef Stock Powder.
                    </li>
                    <li>
                      <strong>Liquids:</strong> Add tomatoes + <strong>1–1½ cups</strong> water or red wine to just{" "}
                      <strong>barely</strong> cover.
                    </li>
                    <li>
                      <strong>Simmer low:</strong> Lid on, <strong>gentle simmer 3–4 hours</strong>, turning pieces
                      occasionally. Maintain a <strong>very low bubble</strong>—top up liquid as needed.
                    </li>
                    <li>
                      <strong>Finish:</strong> When gelatin-soft (meat pulls from bone), adjust seasoning. Rest{" "}
                      <strong>10 min</strong> off heat.
                    </li>
                  </ol>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Notes
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/90">
                    <li>Serve with pap or mash.</li>
                    <li>Optional Rooibaard Chilli Sauce for heat.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-4">
                <div className="self-start rounded-2xl border border-border/40 bg-white/5 shadow-md p-5">
                  <ShopIngredients items={STOCKED_ITEMS} recipeSlug="oxtail-potjie-worcester" />
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
