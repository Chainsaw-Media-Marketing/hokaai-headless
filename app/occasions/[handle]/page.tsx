import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { FilterSidebar } from "@/components/filter-sidebar"
import { sampleProducts, occasionTags } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"

interface OccasionPageProps {
  params: {
    handle: string
  }
}

export default function OccasionPage({ params }: OccasionPageProps) {
  // Find occasion by handle
  const occasion = occasionTags.find((o) => o.handle === params.handle)

  if (!occasion) {
    notFound()
  }

  // Filter products based on occasion
  const filteredProducts = sampleProducts.filter((product) => {
    return (
      product.tags.includes(params.handle) || (params.handle === "ready-to-braai" && product.tags.includes("marinated"))
    )
  })

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Occasion Hero */}
        <section className="relative h-64 md:h-80">
          <Image src={occasion.image || "/placeholder.svg"} alt={occasion.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-h1 font-heading font-bold mb-4 drop-shadow-lg">{occasion.title}</h1>
              <p className="text-xl drop-shadow-md">Perfect cuts for every occasion</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-700">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} for{" "}
                  {occasion.title.toLowerCase()}
                </p>

                <select className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <ProductGrid products={filteredProducts} showQuickAdd />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  return occasionTags.map((occasion) => ({
    handle: occasion.handle,
  }))
}
