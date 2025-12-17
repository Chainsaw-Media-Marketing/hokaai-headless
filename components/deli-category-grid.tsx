import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DeliCategory {
  title: string
  description: string
  image: string
  href: string
}

const deliCategories: DeliCategory[] = [
  {
    title: "Biltong",
    description: "Traditional dried meat in various cuts and flavors",
    image: "/images/biltong-20default.jpg",
    href: "/collections/deli-biltong?department=deli-biltong&deli_type=biltong",
  },
  {
    title: "Droëwors",
    description: "Authentic South African dried sausage",
    image: "/images/original-20drywors.jpg",
    href: "/collections/deli-biltong?department=deli-biltong&deli_type=droewors",
  },
  {
    title: "Sticks",
    description: "Flavorful meat sticks in various styles",
    image: "/images/biltong-20sticks.jpg",
    href: "/collections/deli-biltong?department=deli-biltong&deli_type=sticks",
  },
  {
    title: "Bacon Biltong",
    description: "Delicious bacon-style biltong varieties",
    image: "/images/bacon-20biltong.jpg",
    href: "/collections/deli-biltong?department=deli-biltong&deli_type=bacon-biltong",
  },
]

export function DeliCategoryGrid() {
  const mainDeliUrl = "/collections/deli-biltong"

  return (
    <>
      <div className="lg:hidden text-center">
        <p className="text-sm text-slate-600 mb-6">Traditional South African dried meats and deli specialties</p>
        <Button asChild size="lg" className="h-12 px-8">
          <Link href={mainDeliUrl}>Shop Deli & Biltong</Link>
        </Button>
      </div>

      {/* Desktop: Original multi-category grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {deliCategories.map((category) => (
          <Link key={category.title} href={category.href} className="group">
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-lg text-brand-primary mb-2">{category.title}</h3>
                <p className="text-sm text-slate-600">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
