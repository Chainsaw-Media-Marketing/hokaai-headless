import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
            <CardContent className="p-6 sm:p-4 text-center">
              <h3 className="font-semibold text-lg text-brand-primary mb-2">{category.title}</h3>
              <p className="text-sm text-slate-600">{category.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
