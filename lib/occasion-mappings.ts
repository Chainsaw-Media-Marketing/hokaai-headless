// Static mappings for Shop by Occasion menu items
// Each item maps to either filters or a specific product handle

export interface OccasionItemMapping {
  type: "filter" | "product"
  // For filter type
  filters?: {
    occasion?: string | string[] // Allow array for OR logic
    department?: string
    meat_type?: string
    cut_family?: string | string[]
    bulk_type?: string
    braai_gear_family?: string
  }
  // For product type
  productHandle?: string
}

export const occasionItemMappings: Record<string, OccasionItemMapping> = {
  // View All by Occasion (top-level)
  "View All by Occasion": {
    type: "filter",
    filters: {
      occasion: ["braai", "ready-to-braai", "stew", "roast", "quick", "bulk", "snack"] as any,
    },
  },

  // Great for Braai
  "Great for Braai → View All": {
    type: "filter",
    filters: {
      occasion: "braai",
      department: "butchery",
    },
  },
  "Great for Braai → Steaks": {
    type: "filter",
    filters: {
      occasion: "braai",
      department: "butchery",
      cut_family: "steaks",
    },
  },
  "Great for Braai → Boerewors & Cheese Wors": {
    type: "filter",
    filters: {
      occasion: "braai",
      department: "butchery",
      meat_type: "wors-sausages",
    },
  },
  "Great for Braai → Chicken Flatties": {
    type: "product",
    productHandle: "chicken-flatties",
  },
  "Great for Braai → Sosaties": {
    type: "filter",
    filters: {
      occasion: "braai",
      department: "butchery",
      cut_family: "sosaties",
    },
  },
  "Great for Braai → Pork Chops & Ribs": {
    type: "filter",
    filters: {
      occasion: "braai",
      department: "butchery",
      meat_type: "pork",
      cut_family: ["chops", "ribs"],
    },
  },
  "Great for Braai → Wood & Charcoal": {
    type: "filter",
    filters: {
      department: "braai-gear",
      braai_gear_family: "wood-charcoal",
    },
  },

  // Great for Stew & Potjiekos
  "Great for Stew & Potjiekos → View All": {
    type: "filter",
    filters: {
      occasion: "stew",
      department: "butchery",
    },
  },
  "Great for Stew & Potjiekos → Beef Stew (Bone-in / Boneless)": {
    type: "filter",
    filters: {
      occasion: "stew",
      department: "butchery",
      meat_type: "beef",
      cut_family: "stew-stirfry",
    },
  },
  "Great for Stew & Potjiekos → Beef Shin": {
    type: "product",
    productHandle: "beef-shin",
  },
  "Great for Stew & Potjiekos → Oxtail": {
    type: "product",
    productHandle: "oxtail",
  },
  "Great for Stew & Potjiekos → Lamb Shanks": {
    type: "product",
    productHandle: "lamb-shanks-350g",
  },
  "Great for Stew & Potjiekos → Lamb Potjiekos": {
    type: "product",
    productHandle: "lamb-potjiekos",
  },
  "Great for Stew & Potjiekos → Pork Stew": {
    type: "filter",
    filters: {
      occasion: "stew",
      department: "butchery",
      meat_type: "pork",
      cut_family: "stew-stirfry",
    },
  },

  // Great for Roasts
  "Great for Roasts → View All": {
    type: "filter",
    filters: {
      occasion: "roast",
      department: "butchery",
    },
  },
  "Great for Roasts → Whole Leg of Lamb / Deboned Leg of Lamb": {
    type: "filter",
    filters: {
      occasion: "roast",
      department: "butchery",
      meat_type: "lamb",
      cut_family: "roasts",
    },
  },
  "Great for Roasts → Pork Leg / Deboned Pork Leg": {
    type: "filter",
    filters: {
      occasion: "roast",
      department: "butchery",
      meat_type: "pork",
      cut_family: "roasts",
    },
  },
  "Great for Roasts → Pork Neck Whole": {
    type: "product",
    productHandle: "pork-neck-whole",
  },
  "Great for Roasts → Whole Chicken": {
    type: "filter",
    filters: {
      occasion: "roast",
      department: "butchery",
      meat_type: "chicken",
      cut_family: "whole-bird",
    },
  },
  "Great for Roasts → Beef Chuck": {
    type: "filter",
    filters: {
      occasion: "roast",
      department: "butchery",
      meat_type: "beef",
      cut_family: "roasts",
    },
  },

  // Weeknight Quick & Easy
  "Weeknight Quick & Easy → View All": {
    type: "filter",
    filters: {
      occasion: "quick",
      department: "butchery",
    },
  },
  "Weeknight Quick & Easy → Beef Stirfry": {
    type: "product",
    productHandle: "beef-stirfry",
  },
  "Weeknight Quick & Easy → Pork Stirfry": {
    type: "product",
    productHandle: "pork-stirfry",
  },
  "Weeknight Quick & Easy → Chicken Thighs, Drumsticks, Wings": {
    type: "filter",
    filters: {
      occasion: "quick",
      department: "butchery",
      meat_type: "chicken",
      cut_family: "pieces",
    },
  },
  "Weeknight Quick & Easy → Chicken Breast Fillets": {
    type: "product",
    productHandle: "chicken-breast-fillets",
  },
  "Weeknight Quick & Easy → Mince & Patties": {
    type: "filter",
    filters: {
      occasion: "quick",
      department: "butchery",
      cut_family: "mince-burgers",
    },
  },

  // Ready to Braai (Marinated & Flavoured)
  "Ready to Braai (Marinated & Flavoured) → View All": {
    type: "filter",
    filters: {
      occasion: "ready-to-braai",
      department: "butchery",
    },
  },
  "Ready to Braai (Marinated & Flavoured) → Chicken Flatties (Marinated)": {
    type: "product",
    productHandle: "chicken-flatties",
  },
  "Ready to Braai (Marinated & Flavoured) → Beef Sosaties (BBQ, Red Wine & Garlic, Sweet Curry)": {
    type: "filter",
    filters: {
      occasion: "ready-to-braai",
      department: "butchery",
      meat_type: "beef",
      cut_family: "sosaties",
    },
  },
  "Ready to Braai (Marinated & Flavoured) → Chicken Sosaties (BBQ, Honey Mustard, Lemon & Herb, Sweet Curry)": {
    type: "filter",
    filters: {
      occasion: "ready-to-braai",
      department: "butchery",
      meat_type: "chicken",
      cut_family: "sosaties",
    },
  },
  "Ready to Braai (Marinated & Flavoured) → Lamb Sosaties (BBQ Rib, Red Wine & Garlic, Leg Sosaties)": {
    type: "filter",
    filters: {
      occasion: "ready-to-braai",
      department: "butchery",
      meat_type: "lamb",
      cut_family: "sosaties",
    },
  },

  // Bulk & Hampers
  "Bulk & Hampers → View All": {
    type: "filter",
    filters: {
      occasion: "bulk",
    },
  },
  "Bulk & Hampers → Quarter Lamb Pack": {
    type: "product",
    productHandle: "quarter-lamb-pack-6kg",
  },
  "Bulk & Hampers → Whole Lamb": {
    type: "product",
    productHandle: "whole-lamb",
  },
  "Bulk & Hampers → All Meat Hampers": {
    type: "filter",
    filters: {
      occasion: "bulk",
      bulk_type: "hamper",
    },
  },
  "Bulk & Hampers → Biltong Hampers": {
    type: "filter",
    filters: {
      occasion: "bulk",
      department: "deli-biltong",
      bulk_type: "hamper",
    },
  },
}

// Helper function to get URL for an occasion item
export function getOccasionItemUrl(categoryTitle: string, itemTitle: string): string {
  if (itemTitle === "View All by Occasion") {
    return buildMultiOccasionUrl(["braai", "ready-to-braai", "stew", "roast", "quick", "bulk", "snack"])
  }

  const key = `${categoryTitle} → ${itemTitle}`
  const mapping = occasionItemMappings[key]

  if (!mapping) {
    console.warn(`[v0] No mapping found for occasion item: ${key}`)
    return "/collections/butchery"
  }

  if (mapping.type === "product") {
    return `/products/${mapping.productHandle}`
  }

  // Build filter URL
  const params = new URLSearchParams()
  const filters = mapping.filters!

  if (filters.occasion) {
    if (Array.isArray(filters.occasion)) {
      filters.occasion.forEach((occ) => params.append("occasion", occ))
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
  if (filters.braai_gear_family) {
    params.append("braai_gear_family", filters.braai_gear_family)
  }

  const url = `/collections/butchery?${params.toString()}`

  return url
}

// Helper function to build URL with multiple occasion values
export function buildMultiOccasionUrl(occasions: string[]): string {
  const params = new URLSearchParams()
  params.append("occasion", occasions.join(","))
  return `/collections/butchery?${params.toString()}`
}
