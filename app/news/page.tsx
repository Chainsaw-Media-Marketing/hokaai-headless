import Link from "next/link"
import { recipes } from "@/lib/recipes-data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Recipes & Inspiration | Hokaai Meat Market",
  description: "From our kitchen to your braai — explore easy recipes, tips, and flavour ideas.",
}

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/braai-grill-with-flames-and-meat.jpg')] bg-cover bg-center opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl lg:text-6xl font-bold mb-6 text-balance">Recipes & Inspiration</h1>
              <p className="text-lg lg:text-xl text-slate-300 text-pretty">
                From our kitchen to your braai — explore easy recipes, tips, and flavour ideas.
              </p>
            </div>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.slug}
                  href={`/news/${recipe.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-slate-200 overflow-hidden">
                    <img
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="font-heading text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-red transition-colors">
                      {recipe.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{recipe.description}</p>
                    <span className="inline-flex items-center text-brand-red font-medium text-sm group-hover:gap-2 transition-all">
                      View Recipe
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
