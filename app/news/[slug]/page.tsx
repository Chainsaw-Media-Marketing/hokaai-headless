import Link from "next/link"
import { notFound } from "next/navigation"
import { recipes } from "@/lib/recipes-data"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export async function generateStaticParams() {
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const recipe = recipes.find((r) => r.slug === params.slug)

  if (!recipe) {
    return {
      title: "Recipe Not Found | Hokaai Meat Market",
    }
  }

  return {
    title: `${recipe.title} | Hokaai Meat Market`,
    description: recipe.description,
  }
}

export default function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = recipes.find((r) => r.slug === params.slug)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Back Button */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/news"
              className="inline-flex items-center text-slate-600 hover:text-brand-red transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Recipes
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="aspect-[21/9] bg-slate-200 overflow-hidden">
          <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-full object-cover" />
        </div>

        {/* Recipe Content */}
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Title & Intro */}
            <div className="mb-12">
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-slate-900 mb-6 text-balance">
                {recipe.title}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed text-pretty">{recipe.description}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Ingredients */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-8">
                  <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Ingredients</h2>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-brand-red rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Method */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Method</h2>
                  <ol className="space-y-6">
                    {recipe.method.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-red text-white rounded-full font-bold text-sm mr-4 flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-slate-700 leading-relaxed pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>

                  {/* Tip Box */}
                  {recipe.tip && (
                    <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6">
                      <h3 className="font-heading font-bold text-amber-900 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Pro Tip
                      </h3>
                      <p className="text-amber-800 leading-relaxed">{recipe.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Back to Recipes Button */}
            <div className="mt-12 text-center">
              <Link
                href="/news"
                className="inline-flex items-center justify-center bg-brand-red text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to All Recipes
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
