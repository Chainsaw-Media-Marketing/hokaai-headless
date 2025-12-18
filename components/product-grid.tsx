import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  showQuickAdd?: boolean
  gridDensity?: "comfortable" | "compact"
  collectionUrl?: string
  mobileGridCols?: 1 | 2
}

export function ProductGrid({
  products,
  showQuickAdd = false,
  gridDensity = "comfortable",
  collectionUrl,
  mobileGridCols = 2,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
      </div>
    )
  }

  const mobileColClass = mobileGridCols === 1 ? "grid-cols-1" : "grid-cols-2"

  const gridClasses =
    gridDensity === "compact"
      ? `grid ${mobileColClass} lg:grid-cols-4 gap-6 lg:gap-4`
      : `grid ${mobileColClass} lg:grid-cols-3 gap-6`

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showQuickAdd={showQuickAdd} collectionUrl={collectionUrl} />
      ))}
    </div>
  )
}
