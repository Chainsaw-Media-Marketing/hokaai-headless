import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RecipeScrollManager } from "@/components/recipes/RecipeScrollManager"
import Link from "next/link"
import Image from "next/image"

export default function RecipesPage() {
  const sections = [
    {
      title: "Braai",
      recipes: [
        {
          slug: "ribeye-garlic-butter",
          title: "Ribeye Steak with Garlic Butter & Braai Spice",
          blurb: "Premium ribeye steaks seasoned with Braai Salt and Meat Spice, topped with garlic butter.",
          occasion: "Braai",
          time: "30 min",
          serves: "4",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ribeye%20Steak%20with%20Garlic%20Butter%20%26%20Braai%20Spice-TslTqZ5VwfSEUlyCGhIz7h0yKgjHTx.png",
        },
        {
          slug: "picanha-garlic-herb",
          title: "Picanha (Rump Cap) with Garlic-Herb Baste",
          blurb: "Tender picanha grilled to perfection with a garlic-herb baste and Lemon & Herb finish.",
          occasion: "Braai",
          time: "45 min",
          serves: "4–6",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picanha%20with%20Garlic-Herb%20Baste-uophh4Cm2bULWMSUApfbbCXIGktota.png",
        },
      ],
    },
    {
      title: "Roasts",
      recipes: [
        {
          slug: "brisket-brown-onion-gravy",
          title: "Slow-Roasted Deboned Brisket with Brown-Onion Gravy",
          blurb: "Tender deboned brisket slow-roasted with brown onions and rich beef gravy.",
          occasion: "Roast",
          time: "4 h",
          serves: "6",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slow%20Roasted%20Deboned%20Brisket%20with%20Brown-Onion%20Gravy-zxCHwtutlXAn2Keu4g1w02600LokTM.png",
        },
        {
          slug: "chicken-star-pack-tray-roast",
          title: "Lemon-Herb Chicken Star Pack Tray Roast",
          blurb: "Chicken Star Pack roasted with lemon, herbs, and Chicken Spice for a golden finish.",
          occasion: "Roast",
          time: "1 h",
          serves: "4",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lemon-Herb%20Chicken%20Star%20Pack%20Tray%20Roast-zl8C07N1YYMdVshUnh5dDenUSrBmxd.png",
        },
      ],
    },
    {
      title: "Weeknight Quick & Easy",
      recipes: [
        {
          slug: "beef-stirfry-garlic-veggie",
          title: "Beef Stir-Fry with Garlic & Veggie Sprinkle",
          blurb: "Quick beef stir-fry with vegetables, seasoned with Six Gun Grill and Veggie Sprinkle.",
          occasion: "Weeknight",
          time: "25 min",
          serves: "4",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Beef%20Stir-Fry%20with%20Garlic%20%26%20Veggie%20Sprinkle-6veDcY2q1cPEK4o9NAOQ3dJvkK8zun.png",
        },
        {
          slug: "creamy-chicken-fillet-pasta",
          title: "Creamy Chicken Fillet Pasta Bake",
          blurb: "Chicken fillets in creamy mushroom and cheese sauce, baked with pasta.",
          occasion: "Weeknight",
          time: "40 min",
          serves: "4–6",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Creamy%20Chicken%20Fillet%20Pasta%20Bake-2T4FWWlOIOZKDECqjvmIQdZDxXGJ9F.png",
        },
      ],
    },
    {
      title: "Stew / Potjie",
      recipes: [
        {
          slug: "oxtail-potjie-worcester",
          title: "Classic Oxtail Potjie with Worcester Braai Mix",
          blurb: "Tender oxtail slow-cooked with Worcester Braai Mix and vegetables.",
          occasion: "Potjie",
          time: "3½ h",
          serves: "6",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Classic%20Octail%20Potjie%20with%20Worcester%20Braai%20Mix-DNQ3pd6B30KCAkPx1vt9cEt0zNk9kM.png",
        },
        {
          slug: "beef-goulash-red-wine-garlic",
          title: "Beef Goulash with Red Wine & Garlic",
          blurb: "Rich beef goulash simmered with red wine, garlic, and Masala Spice.",
          occasion: "Stew",
          time: "2 h",
          serves: "6",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Beef%20Goulash%20with%20Red%20Wine%20%26%20Garlic-zwUj9zqTeneoU4HfzumLB2k3fHpuwY.png",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      <RecipeScrollManager />
      <Header />

      <main>
        {/* Hero Banner */}
        <section className="container mx-auto px-6 lg:px-8 pt-8">
          <div className="relative min-h-[260px] md:min-h-[320px] rounded-2xl overflow-hidden mb-8">
            <Image src="/braai-grilling-meat-fire.jpg" alt="Braai grilling" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 flex flex-col justify-center h-full">
              <h1 className="text-white drop-shadow-lg text-3xl md:text-5xl font-semibold mb-4">
                Family Recipes by Hokaai
              </h1>
              <p className="text-white/95 drop-shadow text-lg md:text-xl mb-6 max-w-2xl">
                Real SA flavour. Easy, reliable, and made with Hokaai favourites.
              </p>
              <div>
                <Link
                  href="/recipes/ribeye-garlic-butter"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-brand-red)] text-white font-semibold rounded-lg hover:bg-[var(--color-brand-red)]/90 transition-colors"
                >
                  Try a Braai favourite
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Sections */}
        <section className="py-8 pb-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {sections.map((section) => (
                <div key={section.title} className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-semibold text-brand-primary mb-6 relative group inline-block">
                    {section.title}
                    <span className="absolute left-0 -bottom-1 h-0.5 w-16 bg-[var(--color-brand-red)]" />
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.recipes.map((recipe) => (
                      <Link
                        key={recipe.slug}
                        href={`/recipes/${recipe.slug}`}
                        className="group rounded-2xl border border-border/40 bg-white/5 hover:shadow-lg transition-all overflow-hidden"
                      >
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <Image
                            src={recipe.image || "/placeholder.svg"}
                            alt={recipe.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg md:text-xl font-semibold text-brand-primary mb-2 group-hover:text-[var(--color-brand-red)] transition-colors">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{recipe.blurb}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-1 text-xs text-foreground/80">
                              {recipe.occasion}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-1 text-xs text-foreground/80">
                              {recipe.time}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-1 text-xs text-foreground/80">
                              Serves {recipe.serves}
                            </span>
                          </div>
                          <span className="text-[var(--color-brand-red)] text-sm font-medium group-hover:underline">
                            View recipe →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
