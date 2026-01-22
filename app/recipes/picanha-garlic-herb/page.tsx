"use client"

// TEST NOTES: Recipe page renders with hero header, breadcrumbs, improved typography, grid layout, and sticky "Shop these ingredients" card (v1).

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShopIngredients } from "@/components/recipes/ShopIngredients"
import { CopyLink } from "@/components/ui/CopyLink"
import { STOCKED_ITEMS } from "./stocked-items"
import Link from "next/link"
import { useEffect } from "react"

export default function PicanhaGarlicHerbPage() {
  const recipeData = {
    title: "Picanha (Rump Cap) with Garlic-Herb Baste",
    occasion: "Braai",
    time: "45 min",
    serves: "4–6",
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picanha%20with%20Garlic-Herb%20Baste-uophh4Cm2bULWMSUApfbbCXIGktota.png"
              alt="Picanha with Garlic-Herb Baste"
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
                    <li>4 × 250 g Hokaai Beef Picanha (Rump Cap)</li>
                    <li>3 tbsp Scalli's Steak & Chops Sauce 500 ml</li>
                    <li>2 tsp Ina Paarman Lemon & Herb C&C 200 ml</li>
                    <li>2 tbsp olive oil</li>
                    <li>3 cloves garlic, minced</li>
                    <li>1 tbsp fresh thyme or 1–2 tsp finely chopped rosemary</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Method
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ol className="list-decimal pl-6 mt-4 space-y-3 text-foreground/90">
                    <li>
                      <strong>Prep:</strong> Score fat cap lightly (don't cut into meat). Mix Steak & Chops sauce, oil,
                      garlic, rosemary.
                    </li>
                    <li>
                      <strong>Season/baste:</strong> Brush all over; rest <strong>10–15 min</strong> while preparing the fire.
                    </li>
                    <li>
                      <strong>Sear fat:</strong> Start <strong>fat-side down</strong> over medium coals{" "}
                      <strong>2–3 min</strong> to render and crisp; manage flare-ups.
                    </li>
                    <li>
                      <strong>Grill:</strong> Sear over direct medium-high heat <strong>3–4 min per side</strong>.
                      For a thick whole piece, move to <strong>indirect</strong> heat and continue cooking 10–15 min
                      until target temperature is reached.
                    </li>
                    <li>
                      <strong>Target temp:</strong> <strong>52–55 °C</strong> (MR) / <strong>58–60 °C</strong> (M).
                    </li>
                    <li>
                      <strong>Rest & finish:</strong> Rest <strong>10 min</strong>. Slice{" "}
                      <strong>across the grain</strong>. Brush slices lightly with Lemon & Herb C&C as a finishing
                      glaze, or serve the sauce on the side.
                    </li>
                  </ol>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Notes
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/90">
                    <li>Serve with garlic rolls and a green salad.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-4">
                <div className="self-start rounded-2xl border border-border/40 bg-white/5 shadow-md p-5">
                  <ShopIngredients items={STOCKED_ITEMS} recipeSlug="picanha-garlic-herb" />
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
