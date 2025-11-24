// This ensures each View All button goes to the correct collection page with the right filters applied

type FilterParams = {
  department?: string
  meat_type?: string
  cut_family?: string | string[]
  deli_type?: string
  bulk_type?: string | string[]
  grocery_family?: string
  spice_family?: string
  braai_gear_family?: string
}

type ViewAllMapping = {
  collection: string
  filters: FilterParams
}

// Static mapping of View All button identifiers to their filter parameters
export const viewAllMappings: Record<string, ViewAllMapping> = {
  // Top level
  "View All Butchery": {
    collection: "butchery",
    filters: { department: "butchery" },
  },
  "View All Deli & Biltong": {
    collection: "deli-biltong",
    filters: { department: "deli-biltong" },
  },
  "View All Spices & Sauces": {
    collection: "spices-sauces",
    filters: { department: "spices-sauces" },
  },
  "View All Braai Gear": {
    collection: "braai-gear",
    filters: { department: "braai-gear" },
  },
  "View All Groceries": {
    collection: "groceries",
    filters: { department: "groceries" },
  },

  // Butchery → Meat types
  "View All Beef": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef" },
  },
  "View All Lamb": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "lamb" },
  },
  "View All Pork": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork" },
  },
  "View All Chicken": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "chicken" },
  },
  "View All Wors & Sausages": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "wors-sausages" },
  },
  "View All Sosaties": {
    collection: "butchery",
    filters: { department: "butchery", cut_family: "sosaties" },
  },
  "View All Bacon Rashers & Ham": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "bacon-ham" },
  },
  "View All Hampers & Value Packs": {
    collection: "butchery",
    filters: { department: "butchery", bulk_type: "hamper" },
  },

  // Butchery → Beef (submenus)
  "View All Beef → Steaks": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef", cut_family: "steaks" },
  },
  "View All Beef → Ribs & Rashers & Brisket & CHUCK": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef", cut_family: ["ribs-brisket", "ribs"] },
  },
  "View All Beef → Roasts & Large Cuts": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef", cut_family: "roasts" },
  },
  "View All Beef → Mince & Burgers": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef", cut_family: "mince-burgers" },
  },
  "View All Beef → Stew & Stirfry & Other": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef", cut_family: "stew-stirfry" },
  },
  "View All Beef → OXTAIL & Speciality": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef", cut_family: "oxtail" },
  },
  "View All Beef → Sosaties": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef", cut_family: "sosaties" },
  },

  // Butchery → Lamb (submenus)
  "View All Lamb → Chops & Steaks": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "lamb", cut_family: ["chops", "steaks"] },
  },
  "View All Lamb → Ribs": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "lamb", cut_family: "ribs" },
  },
  "View All Lamb → Roasts & Large Cuts": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "lamb", cut_family: "roasts" },
  },
  "View All Lamb → Stew & Pot Cuts": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "lamb", cut_family: "stew-stirfry" },
  },
  "View All Lamb → Sosaties": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "lamb", cut_family: "sosaties" },
  },
  "View All Lamb → Bulk/Whole": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "lamb", bulk_type: ["whole-lamb", "half-lamb", "quarter-lamb"] },
  },

  // Butchery → Pork (submenus)
  "View All Pork → Chops & Steaks": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork", cut_family: ["chops", "steaks"] },
  },
  "View All Pork → Belly, Ribs & Rashers": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork", cut_family: ["belly", "ribs", "rashers"] },
  },
  "View All Pork → Roasts & Large Cuts": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork", cut_family: "roasts" },
  },
  "View All Pork → Stew & Stirfry": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork", cut_family: "stew-stirfry" },
  },
  "View All Pork → Eisbein & Specialty": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork", cut_family: "knuckle-hock" },
  },
  "View All Pork → Gammon": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork", cut_family: "gammon" },
  },
  "View All Pork → Sosaties": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork", cut_family: "sosaties" },
  },

  // Butchery → Chicken (submenus)
  "View All Chicken → Whole & Flatties": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "chicken", cut_family: "whole-bird" },
  },
  "View All Whole Chicken": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "chicken", cut_family: "whole-bird" },
  },
  "View All Chicken → Cuts": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "chicken", cut_family: ["wings-drumsticks", "pieces"] },
  },
  "View All Chicken → Sosaties": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "chicken", cut_family: "sosaties" },
  },

  // Butchery → Sosaties (standalone section submenus)
  "View All Sosaties → Beef": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "beef", cut_family: "sosaties" },
  },
  "View All Sosaties → Lamb": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "lamb", cut_family: "sosaties" },
  },
  "View All Sosaties → Pork": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "pork", cut_family: "sosaties" },
  },
  "View All Sosaties → Chicken": {
    collection: "butchery",
    filters: { department: "butchery", meat_type: "chicken", cut_family: "sosaties" },
  },

  // Deli & Biltong (submenus)
  "View All Biltong": {
    collection: "deli-biltong",
    filters: { department: "deli-biltong", deli_type: "biltong" },
  },
  "View All Droëwors": {
    collection: "deli-biltong",
    filters: { department: "deli-biltong", deli_type: "droewors" },
  },
  "View All Sticks": {
    collection: "deli-biltong",
    filters: { department: "deli-biltong", deli_type: "sticks" },
  },
  "View All Thin Sticks": {
    collection: "deli-biltong",
    filters: { department: "deli-biltong", deli_type: "thin-sticks" },
  },
  "View All Bacon Biltong": {
    collection: "deli-biltong",
    filters: { department: "deli-biltong", deli_type: "bacon-biltong" },
  },
  "View All Other": {
    collection: "deli-biltong",
    filters: { department: "deli-biltong", deli_type: "other" },
  },

  // Groceries (submenus)
  "View All Cold Drinks": {
    collection: "groceries",
    filters: { department: "groceries", grocery_family: "cold-drinks" },
  },
  "View All Pantry Staples": {
    collection: "groceries",
    filters: { department: "groceries", grocery_family: "pantry-staples" },
  },
  "View All Snacks": {
    collection: "groceries",
    filters: { department: "groceries", grocery_family: "snacks" },
  },

  // Spices & Sauces (submenus)
  "View All Spices & Rubs": {
    collection: "spices-sauces",
    filters: { department: "spices-sauces", spice_family: "spices-rubs" },
  },
  "View All Sauces & Marinades": {
    collection: "spices-sauces",
    filters: { department: "spices-sauces", spice_family: "sauces-marinades" },
  },
  "View All Stocks & Gravies": {
    collection: "spices-sauces",
    filters: { department: "spices-sauces", spice_family: "stocks-gravies" },
  },

  // Braai Gear (submenus)
  "View All Grids & Tongs": {
    collection: "braai-gear",
    filters: { department: "braai-gear", braai_gear_family: "grids-tongs" },
  },
  "View All Pots & Potjie Care": {
    collection: "braai-gear",
    filters: { department: "braai-gear", braai_gear_family: "pots-potjie-care" },
  },
  "View All Tools & Thermometers": {
    collection: "braai-gear",
    filters: { department: "braai-gear", braai_gear_family: "tools-thermometers" },
  },
  "View All Cleaners & Scoops": {
    collection: "braai-gear",
    filters: { department: "braai-gear", braai_gear_family: "cleaners-scoops" },
  },
  "View All Wood & Charcoal": {
    collection: "braai-gear",
    filters: { department: "braai-gear", braai_gear_family: "wood-charcoal" },
  },
}

// Helper function to build URL from mapping
export function getViewAllUrlFromMapping(key: string): string {
  const mapping = viewAllMappings[key]
  if (!mapping) {
    console.warn(`[v0] No mapping found for View All key: ${key}`)
    return "/collections/all"
  }

  const { collection, filters } = mapping

  // If no filters, return collection URL directly
  if (Object.keys(filters).length === 0) {
    return `/collections/${collection}`
  }

  // Build query string from filters
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v))
    } else if (value) {
      params.append(key, value)
    }
  })

  return `/collections/${collection}?${params.toString()}`
}
