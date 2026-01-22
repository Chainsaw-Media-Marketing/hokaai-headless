"use client"

// TEST NOTES: Recipe page renders with hero header, breadcrumbs, improved typography, grid layout, and sticky "Shop these ingredients" card (v1).

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShopIngredients } from "@/components/recipes/ShopIngredients"
import { CopyLink } from "@/components/ui/CopyLink"
import { STOCKED_ITEMS } from "./stocked-items"
import Link from "next/link"
import { useEffect } from "react"

export default function BrisketBrownOnionGravyPage() {
  const recipeData = {
    title: "Slow-Roasted Deboned Brisket with Brown-Onion Gravy",
    occasion: "Roast",
    time: "3 h",
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slow%20Roasted%20Deboned%20Brisket%20with%20Brown-Onion%20Gravy-zxCHwtutlXAn2Keu4g1w02600LokTM.png"
              alt="Slow Roasted Deboned Brisket with Brown-Onion Gravy"
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
                    <li>2 × 500 g Hokaai Deboned Beef Brisket</li>
                    <li>2 large onions, sliced</li>
                    <li>2 tsp Ina Paarman Beef Stock Powder 150 g</li>
                    <li>1 × 200 ml Ina Paarman Roast Beef Gravy</li>
                    <li>2 tbsp oil, salt & pepper</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Method
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ol className="list-decimal pl-6 mt-4 space-y-3 text-foreground/90">
                    <li>
                      <strong>Sear brisket:</strong> Preheat oven to <strong>160 °C</strong> (fan 150). Season brisket
                      generously with salt & pepper. Heat oil in a roasting pan over medium-high stove heat. Sear
                      brisket <strong>4–5 min per side</strong> until well browned. Remove and set aside.
                    </li>
                    <li>
                      <strong>Brown onions:</strong> In the same pan over medium heat, add onions; cook{" "}
                      <strong>8–10 min</strong> to deep golden, scraping up browned bits from the brisket.
                    </li>
                    <li>
                      <strong>Pan base:</strong> Stir in Beef Stock Powder with <strong>½ cup (125 ml)</strong> hot
                      water to deglaze. Liquid should reach <strong>⅓–½ up the brisket</strong> once meat is added.
                    </li>
                    <li>
                      <strong>Roast:</strong> Nestle seared brisket on onions. Cover tightly (lid/foil). Roast{" "}
                      <strong>3–3½ hours</strong>, turning once at halfway. Check liquid level occasionally and top up
                      with hot water if reducing too much. Cook until <strong>fork-tender</strong> (fork slides in with
                      little resistance).
                    </li>
                    <li>
                      <strong>Finish:</strong> Uncover; stir in Roast Beef Gravy. Roast <strong>25–30 min</strong>{" "}
                      uncovered—the gravy will thicken during this final roast to create a rich glaze.
                    </li>
                    <li>
                      <strong>Rest & slice:</strong> Rest brisket <strong>15–20 min</strong>, loosely covered with foil.
                      Slice <strong>against the grain</strong>; spoon over gravy.
                    </li>
                  </ol>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Notes
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/90">
                    <li>Great with roast veg; Potato Spice on potatoes is a winner.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-4">
                <div className="self-start rounded-2xl border border-border/40 bg-white/5 shadow-md p-5">
                  <ShopIngredients items={STOCKED_ITEMS} recipeSlug="brisket-brown-onion-gravy" />
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
