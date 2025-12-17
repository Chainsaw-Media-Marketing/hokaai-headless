import Link from "next/link"
import Image from "next/image"
import type { OccasionTag } from "@/lib/types"
import { occasionItemMappings } from "@/lib/occasion-mappings"

interface OccasionTilesProps {
  occasions: OccasionTag[]
}

const getOccasionUrl = (occasionHandle: string, occasionTitle: string): string => {
  // Map the occasion handle to the corresponding View All key in occasion-mappings
  const viewAllKeyMap: Record<string, string> = {
    braai: "Great for Braai → View All",
    stew: "Great for Stew & Potjiekos → View All",
    roast: "Great for Roasts → View All",
    quick: "Weeknight Quick & Easy → View All",
    "ready-to-braai": "Ready to Braai (Marinated & Flavoured) → View All",
    bulk: "Bulk & Hampers → View All",
  }

  const mappingKey = viewAllKeyMap[occasionHandle]
  if (!mappingKey) {
    return "/collections/butchery"
  }

  const mapping = occasionItemMappings[mappingKey]
  if (!mapping || mapping.type !== "filter") {
    return "/collections/butchery"
  }

  // Build filter URL using the same logic as the mega menu
  const params = new URLSearchParams()
  const filters = mapping.filters!

  if (filters.occasion) {
    if (Array.isArray(filters.occasion)) {
      params.append("occasion", filters.occasion.join(","))
    } else {
      params.append("occasion", filters.occasion)
    }
  }
  if (filters.department) {
    params.append("department", filters.department)
  }
  if (filters.meat_type) {
    params.append("meat_type", filters.meat_type)
  }
  if (filters.cut_family) {
    if (Array.isArray(filters.cut_family)) {
      filters.cut_family.forEach((cf) => params.append("cut_family", cf))
    } else {
      params.append("cut_family", filters.cut_family)
    }
  }
  if (filters.bulk_type) {
    params.append("bulk_type", filters.bulk_type)
  }

  return `/collections/butchery?${params.toString()}`
}

export function OccasionTiles({ occasions }: OccasionTilesProps) {
  const mobileOccasions = occasions.filter((occ) =>
    ["Ready to Braai", "Bulk & Hampers", "Weeknight Quick & Easy"].includes(occ.title),
  )

  return (
    <>
      {/* Mobile: 2-column grid with 3 filtered tiles and shorter aspect ratio */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        {mobileOccasions.map((occasion) => (
          <Link
            key={occasion.id}
            href={getOccasionUrl(occasion.handle, occasion.title)}
            className="group relative overflow-hidden rounded-2xl aspect-[3/2] block"
          >
            <Image
              src={occasion.image || "/placeholder.svg"}
              alt={occasion.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <h3 className="font-heading font-semibold text-lg text-white text-center px-2 drop-shadow-lg">
                {occasion.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: Original 3-column grid with all occasions */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {occasions.map((occasion) => (
          <Link
            key={occasion.id}
            href={getOccasionUrl(occasion.handle, occasion.title)}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
          >
            <Image
              src={occasion.image || "/placeholder.svg"}
              alt={occasion.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <h3 className="font-heading font-semibold text-2xl text-white text-center px-4 drop-shadow-lg">
                {occasion.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
