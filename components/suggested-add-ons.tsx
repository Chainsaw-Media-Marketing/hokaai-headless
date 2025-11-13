import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface SuggestedAddOnsProps {
  products: Product[]
}

export function SuggestedAddOns({ products }: SuggestedAddOnsProps) {
  return (
    <section className="border-t border-slate-200 pt-12">
      <div className="mb-8">
        <h2 className="text-h3 font-heading font-semibold text-brand-primary mb-4">Goes Well With</h2>
        <p className="text-slate-700">Complete your order with these complementary items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showQuickAdd />
        ))}
      </div>
    </section>
  )
}
