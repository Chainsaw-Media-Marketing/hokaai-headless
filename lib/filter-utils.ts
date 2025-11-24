// Utility functions for mapping collection handles to metafield filters

export interface FilterState {
  meatType: string[]
  cutFamily: string[]
  occasion: string[]
  department: string[]
  deliType: string[]
  spiceFamily: string[]
  braaiGearFamily: string[]
  groceryFamily: string[]
  bulkType: string[]
}

// Map collection handles to their primary metafield filter
export function getCollectionFilters(handle: string): FilterState {
  const filters: FilterState = {
    meatType: [],
    cutFamily: [],
    occasion: [],
    department: [],
    deliType: [],
    spiceFamily: [],
    braaiGearFamily: [],
    groceryFamily: [],
    bulkType: [],
  }

  // Meat type collections
  const meatTypeMap: Record<string, string> = {
    beef: "Beef",
    lamb: "Lamb",
    pork: "Pork",
    chicken: "Chicken",
  }

  // Cut family collections
  const cutFamilyMap: Record<string, string> = {
    steaks: "Steaks",
    "ribs-brisket": "Ribs & Brisket",
    "mince-burgers": "Mince & Burgers",
    "stew-stirfry": "Stew & Stirfry",
    oxtail: "Oxtail & Speciality",
    chops: "Chops",
    belly: "Belly & Rashers",
    rashers: "Belly & Rashers",
    gammon: "Gammon",
    "whole-bird": "Whole Bird",
    pieces: "Chicken Pieces",
    "knuckle-hock": "Knuckle & Hock",
    offal: "Offal",
    sosaties: "Sosaties",
    "bacon-ham": "Bacon & Ham",
    "wors-sausages": "Wors & Sausages",
  }

  // Occasion collections
  const occasionMap: Record<string, string> = {
    braai: "Great for Braai",
    "ready-to-braai": "Ready to Braai",
    stew: "Stew & Potjiekos",
    roast: "Roasts",
    quick: "Weeknight Quick & Easy",
  }

  const departmentMap: Record<string, string> = {
    butchery: "Butchery",
    deli: "Deli & Biltong",
  }

  // Apply filters based on collection handle
  if (meatTypeMap[handle]) {
    filters.meatType.push(meatTypeMap[handle])
  }

  if (cutFamilyMap[handle]) {
    filters.cutFamily.push(cutFamilyMap[handle])
  }

  if (occasionMap[handle]) {
    filters.occasion.push(occasionMap[handle])
  }

  if (departmentMap[handle]) {
    filters.department.push(departmentMap[handle])
  }

  return filters
}

// Parse metafield values (can be comma-separated or JSON arrays)
export function parseMetafieldValue(value: string | undefined): string[] {
  if (!value) return []

  try {
    // Try parsing as JSON array first
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map(String)
    }
    return [String(parsed)]
  } catch {
    // Fall back to comma-separated
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
}

export function productMatchesFilters(
  product: {
    meat_type?: string
    cut_family?: string
    occasion?: string[]
    department?: string
    deli_type?: string
    spice_family?: string
    braai_gear_family?: string
    grocery_family?: string
    bulk_type?: string
  },
  filters: FilterState,
): boolean {
  // If no filters are active, show all products
  const hasActiveFilters =
    filters.meatType.length > 0 ||
    filters.cutFamily.length > 0 ||
    filters.occasion.length > 0 ||
    filters.department.length > 0 ||
    filters.deliType.length > 0 ||
    filters.spiceFamily.length > 0 ||
    filters.braaiGearFamily.length > 0 ||
    filters.groceryFamily.length > 0 ||
    filters.bulkType.length > 0

  if (!hasActiveFilters) return true

  // Product must match ALL active filter categories (AND logic between categories)
  const matchesMeatType =
    filters.meatType.length === 0 || (product.meat_type && filters.meatType.includes(product.meat_type))

  const matchesCutFamily =
    filters.cutFamily.length === 0 || (product.cut_family && filters.cutFamily.includes(product.cut_family))

  const matchesOccasion =
    filters.occasion.length === 0 || (product.occasion && filters.occasion.some((f) => product.occasion?.includes(f)))

  const matchesDepartment =
    filters.department.length === 0 || (product.department && filters.department.includes(product.department))

  const matchesDeliType =
    filters.deliType.length === 0 || (product.deli_type && filters.deliType.includes(product.deli_type))

  const matchesSpiceFamily =
    filters.spiceFamily.length === 0 || (product.spice_family && filters.spiceFamily.includes(product.spice_family))

  const matchesBraaiGearFamily =
    filters.braaiGearFamily.length === 0 ||
    (product.braai_gear_family && filters.braaiGearFamily.includes(product.braai_gear_family))

  const matchesGroceryFamily =
    filters.groceryFamily.length === 0 ||
    (product.grocery_family && filters.groceryFamily.includes(product.grocery_family))

  const matchesBulkType =
    filters.bulkType.length === 0 || (product.bulk_type && filters.bulkType.includes(product.bulk_type))

  return (
    matchesMeatType &&
    matchesCutFamily &&
    matchesOccasion &&
    matchesDepartment &&
    matchesDeliType &&
    matchesSpiceFamily &&
    matchesBraaiGearFamily &&
    matchesGroceryFamily &&
    matchesBulkType
  )
}

export const DEPARTMENT_FAMILY_MAP: Record<string, (keyof FilterState)[]> = {
  butchery: ["meatType", "cutFamily", "occasion", "bulkType"],
  "deli-biltong": ["deliType"],
  "spices-sauces": ["spiceFamily"],
  "braai-gear": ["braaiGearFamily"],
  groceries: ["groceryFamily"],
}

export const FAMILY_TO_DEPARTMENT_MAP: Record<keyof FilterState, string> = {
  meatType: "butchery",
  cutFamily: "butchery",
  occasion: "butchery",
  bulkType: "butchery",
  deliType: "deli-biltong",
  spiceFamily: "spices-sauces",
  braaiGearFamily: "braai-gear",
  groceryFamily: "groceries",
  department: "", // department itself has no parent
}

export function sanitizeFilters(filters: FilterState): FilterState {
  const activeDepartment = filters.department[0] // Only one department can be active

  if (!activeDepartment) {
    // No department set - check if any family facet is set and infer department
    const familyKeys = Object.keys(filters).filter((k) => k !== "department") as (keyof FilterState)[]
    for (const key of familyKeys) {
      if (filters[key].length > 0) {
        const inferredDept = FAMILY_TO_DEPARTMENT_MAP[key]
        if (inferredDept) {
          // Set the inferred department and sanitize
          return sanitizeFilters({ ...filters, department: [inferredDept] })
        }
      }
    }
    // No department and no family facets - return as is
    return filters
  }

  // Department is set - keep only facets that belong to this department
  const allowedFamilies = DEPARTMENT_FAMILY_MAP[activeDepartment] || []
  const sanitized: FilterState = {
    meatType: [],
    cutFamily: [],
    occasion: [],
    department: filters.department,
    deliType: [],
    spiceFamily: [],
    braaiGearFamily: [],
    groceryFamily: [],
    bulkType: [],
  }

  // Copy only the allowed family facets
  allowedFamilies.forEach((family) => {
    sanitized[family] = filters[family]
  })

  return sanitized
}

export function getVisibleFilterGroups(activeDepartment: string | undefined): (keyof FilterState)[] {
  if (!activeDepartment) {
    // No department set - show only department facet
    return ["department"]
  }

  // Department is set - show department + its family groups
  const familyGroups = DEPARTMENT_FAMILY_MAP[activeDepartment] || []
  return ["department", ...familyGroups]
}

export function buildAvailableFilters(
  products: Array<{
    meat_type?: string
    cut_family?: string
    occasion?: string[]
    department?: string
    deli_type?: string
    spice_family?: string
    braai_gear_family?: string
    grocery_family?: string
    bulk_type?: string
  }>,
  activeFilters: FilterState,
) {
  const meatTypeCounts = new Map<string, number>()
  const cutFamilyCounts = new Map<string, number>()
  const occasionCounts = new Map<string, number>()
  const departmentCounts = new Map<string, number>()
  const deliTypeCounts = new Map<string, number>()
  const spiceFamilyCounts = new Map<string, number>()
  const braaiGearFamilyCounts = new Map<string, number>()
  const groceryFamilyCounts = new Map<string, number>()
  const bulkTypeCounts = new Map<string, number>()

  products.forEach((product) => {
    if (product.meat_type) {
      meatTypeCounts.set(product.meat_type, (meatTypeCounts.get(product.meat_type) || 0) + 1)
    }
    if (product.cut_family) {
      cutFamilyCounts.set(product.cut_family, (cutFamilyCounts.get(product.cut_family) || 0) + 1)
    }
    if (product.occasion) {
      product.occasion.forEach((oc) => occasionCounts.set(oc, (occasionCounts.get(oc) || 0) + 1))
    }
    if (product.department) {
      departmentCounts.set(product.department, (departmentCounts.get(product.department) || 0) + 1)
    }
    if (product.deli_type) {
      deliTypeCounts.set(product.deli_type, (deliTypeCounts.get(product.deli_type) || 0) + 1)
    }
    if (product.spice_family) {
      spiceFamilyCounts.set(product.spice_family, (spiceFamilyCounts.get(product.spice_family) || 0) + 1)
    }
    if (product.braai_gear_family) {
      braaiGearFamilyCounts.set(
        product.braai_gear_family,
        (braaiGearFamilyCounts.get(product.braai_gear_family) || 0) + 1,
      )
    }
    if (product.grocery_family) {
      groceryFamilyCounts.set(product.grocery_family, (groceryFamilyCounts.get(product.grocery_family) || 0) + 1)
    }
    if (product.bulk_type) {
      bulkTypeCounts.set(product.bulk_type, (bulkTypeCounts.get(product.bulk_type) || 0) + 1)
    }
  })

  return {
    meatTypes: Array.from(meatTypeCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    cutFamilies: Array.from(cutFamilyCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    occasions: Array.from(occasionCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    departments: Array.from(departmentCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    deliTypes: Array.from(deliTypeCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    spiceFamilies: Array.from(spiceFamilyCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    braaiGearFamilies: Array.from(braaiGearFamilyCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    groceryFamilies: Array.from(groceryFamilyCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    bulkTypes: Array.from(bulkTypeCounts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  }
}

export function applyFilters<
  T extends {
    meat_type?: string
    cut_family?: string
    occasion?: string[]
    department?: string
    deli_type?: string
    spice_family?: string
    braai_gear_family?: string
    grocery_family?: string
    bulk_type?: string
  },
>(products: T[], filters: FilterState): T[] {
  return products.filter((product) => productMatchesFilters(product, filters))
}

export function getFilterDisplayLabel(slug: string): string {
  const labelMap: Record<string, string> = {
    // Department
    "braai-gear": "Braai Gear",
    butchery: "Butchery",
    "deli-biltong": "Deli & Biltong",
    groceries: "Groceries",
    "spices-sauces": "Spices & Sauces",

    // Meat Type
    "bacon-ham": "Bacon & Ham",
    beef: "Beef",
    chicken: "Chicken",
    lamb: "Lamb",
    pork: "Pork",
    "wors-sausages": "Wors & Sausages",

    // Cut Type
    belly: "Belly",
    chops: "Chops",
    gammon: "Gammon",
    "knuckle-hock": "Knuckle / Hock",
    "mince-burgers": "Mince & Burgers",
    offal: "Offal",
    oxtail: "Oxtail",
    pieces: "Chicken Pieces",
    rashers: "Rashers",
    ribs: "Ribs",
    "ribs-brisket": "Ribs & Brisket",
    roasts: "Roasts",
    shanks: "Shanks",
    sosaties: "Sosaties",
    steaks: "Steaks",
    "stew-stirfry": "Stew & Stirfry",
    "whole-bird": "Whole Bird",
    "wings-drumsticks": "Wings & Drumsticks",

    // Bulk Type
    "half-lamb": "Half Lamb",
    hamper: "Hamper",
    "quarter-lamb": "Quarter Lamb",
    "whole-lamb": "Whole Lamb",

    // Occasion
    braai: "Braai",
    bulk: "Bulk",
    quick: "Quick",
    "ready-to-braai": "Ready to Braai",
    roast: "Roast",
    snack: "Snack",
    stew: "Stew",

    // Braai Gear Type
    "cleaners-scoops": "Cleaners & Scoops",
    "grids-tongs": "Grids & Tongs",
    "pots-potjie-care": "Pots & Potjie Care",
    "tools-thermometers": "Tools & Thermometers",
    "wood-charcoal": "Wood & Charcoal",

    // Deli Type
    "bacon-biltong": "Bacon Biltong",
    biltong: "Biltong",
    crumbs: "Crumbs",
    droewors: "Droëwors",
    other: "Other",
    sticks: "Sticks",
    "thin-sticks": "Thin Sticks",
    "wagon-wheels": "Wagon Wheels",

    // Grocery Type
    "cold-drinks": "Cold Drinks",

    // Spice Type
    "sauces-marinades": "Sauces & Marinades",
    "spices-rubs": "Spices & Rubs",
    "stocks-gravies": "Stocks & Gravies",
  }

  return labelMap[slug] || slug
}
