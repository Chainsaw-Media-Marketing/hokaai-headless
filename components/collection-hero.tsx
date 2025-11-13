import Image from "next/image"
import type { Collection } from "@/lib/types"

interface CollectionHeroProps {
  collection: Collection
}

export function CollectionHero({ collection }: CollectionHeroProps) {
  return (
    <section className="relative h-48 md:h-64 bg-slate-100">
      {collection.image && (
        <>
          <Image src={collection.image || "/placeholder.svg"} alt={collection.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-h1 font-heading font-bold mb-4 drop-shadow-lg">{collection.title}</h1>
          {collection.description && <p className="text-lg drop-shadow-md">{collection.description}</p>}
        </div>
      </div>
    </section>
  )
}
