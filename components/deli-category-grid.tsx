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
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BILTONG%20DEFAULT-NXUzgJad3tamNwFTP1YJtPkx5QbGL0.jpg",
    href: "/collections/deli-biltong?department=deli-biltong&deli_type=biltong",
  },
  {
    title: "Droëwors",
    description: "Authentic South African dried sausage",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ORIGINAL%20DRYWORS-l3656iPF0NlUhsPKxTLnXH00kBaJ6i.jpg",
    href: "/collections/deli-biltong?department=deli-biltong&deli_type=droewors",
  },
  {
    title: "Sticks",
    description: "Flavorful meat sticks in various styles",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BILTONG%20STICKS-PD7btCslWdDzuI640u6e94PFapQDLD.jpg",
    href: "/collections/deli-biltong?department=deli-biltong&deli_type=sticks",
  },
  {
    title: "Bacon Biltong",
    description: "Delicious bacon-style biltong varieties",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BACON%20BILTONG-dmybDXDY3Sdr61Mf5oOYnxSYJLE6fA.jpg",
    href: "/collections/deli-biltong?department=deli-biltong&deli_type=bacon-biltong",
  },
]

export function DeliCategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
  )
}
