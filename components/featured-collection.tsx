import Link from "next/link"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface FeaturedCollectionProps {
  title: string
  description: string
  products: Product[]
  viewAllHref: string
}

export function FeaturedCollection({ title, description, products, viewAllHref }: FeaturedCollectionProps) {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-h2 text-brand-primary mb-4">{title}</h2>
        <p className="text-body text-slate-700 max-w-2xl mx-auto mb-8">{description}</p>
        <Link href={viewAllHref}>
          <Button variant="secondary">View All Products</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-12">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} showCategoryLink={true} />
        ))}
      </div>
    </div>
  )
}
