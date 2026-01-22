"use client"

// TEST NOTES: Recipe page renders with hero header, breadcrumbs, improved typography, grid layout, and sticky "Shop these ingredients" card (v1).

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShopIngredients } from "@/components/recipes/ShopIngredients"
import { CopyLink } from "@/components/ui/CopyLink"
import { STOCKED_ITEMS } from "./stocked-items"
import Link from "next/link"
import { useEffect } from "react"

export default function BeefStirfryGarlicVeggiePage() {
  const recipeData = {
    title: "Beef Stir-Fry with Garlic & Veggie Sprinkle",
    occasion: "Weeknight",
    time: "25 min",
    serves: "4",
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Beef%20Stir-Fry%20with%20Garlic%20%26%20Veggie%20Sprinkle-6veDcY2q1cPEK4o9NAOQ3dJvkK8zun.png"
              alt="Beef Stir-Fry with Garlic & Veggie Sprinkle"
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
                    <li>2 × 250 g Hokaai Beef Stirfry</li>
                    <li>2 Tbsp vegetable oil (divided)</li>
                    <li>1 red bell pepper, thinly sliced</li>
                    <li>2 medium carrots, julienned</li>
                    <li>1 cup small broccoli florets</li>
                    <li>4 spring onions, cut into 3 cm pieces (separate white and green parts)</li>
                    <li>3 cloves garlic, minced</li>
                    <li>1 Tbsp Crown Six Gun Grill Seasoning</li>
                    <li>1 tsp Ina Paarman Veggie Sprinkle</li>
                    <li>2 Tbsp soy sauce (optional)</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Method
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ol className="list-decimal pl-6 mt-4 space-y-3 text-foreground/90">
                    <li>
                      <strong>Heat:</strong> Wok or large pan very hot. Add 1 Tbsp oil.
                    </li>
                    <li>
                      <strong>Beef:</strong> Season beef lightly with Six Gun. Stir-fry half the beef{" "}
                      <strong>60–90 sec</strong> until just browned; remove. Repeat with remaining oil and beef.
                    </li>
                    <li>
                      <strong>Veg:</strong> Add vegetables; stir-fry <strong>3–4 min</strong> until tender-crisp.
                    </li>
                    <li>
                      <strong>Combine:</strong> Return beef, add Veggie Sprinkle; toss <strong>30–60 sec</strong>.
                      Optional splash of soy for glaze.
                    </li>
                    <li>
                      <strong>Serve:</strong> Over rice or noodles. Do not overcook beef — keep it tender.
                    </li>
                  </ol>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-2 relative inline-block">
                    Notes
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/90">
                    <li>Serve immediately; stir-fry is best hot and fast.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-4">
                <div className="self-start rounded-2xl border border-border/40 bg-white/5 shadow-md p-5">
                  <ShopIngredients items={STOCKED_ITEMS} recipeSlug="beef-stirfry-garlic-veggie" />
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
