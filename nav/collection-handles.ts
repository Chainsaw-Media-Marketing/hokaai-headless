// nav/collection-handles.ts
// Normalize label strings (case/whitespace/& variations)
function norm(s?: string) {
  return (s || "").toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim()
}

// Exact collection handles your Storefront token can see (+ new ones you created)
const COLLECTIONS: Record<string, string> = {
  // Top / departments & featured
  frontpage: "frontpage",
  butchery: "butchery",
  "deli and biltong": "deli-biltong",
  "spices and sauces": "spices-sauces",
  "braai gear": "braai-gear",
  groceries: "groceries",

  // Meat types
  beef: "beef",
  lamb: "lamb",
  pork: "pork",
  chicken: "chicken",

  // Occasions / promos
  "great for braai": "braai",
  "ready to braai": "ready-to-braai",
  "stew and potjiekos": "stew",
  roasts: "roast",
  "weeknight quick and easy": "quick",
  "bulk and hampers": "bulk",

  // Cut families / subcats
  steaks: "steaks",
  "ribs and brisket": "ribs-brisket",
  "mince and burgers": "mince-burgers",
  "stew and stirfry": "stew-stirfry",
  "oxtail and speciality": "oxtail",
  chops: "chops",
  "belly and rashers": "belly",
  gammon: "gammon",
  "whole bird": "whole-bird",
  "knuckle and hock (eisbein)": "knuckle-hock",
  offal: "offal",
  sosaties: "sosaties",

  // New collections you created earlier
  "bacon and ham": "bacon-ham",
  "wors and sausages": "wors-sausages",
  rashers: "rashers",
  "chicken pieces": "pieces",

  // ✅ Deli & Biltong sub-sections
  biltong: "biltong",
  droewors: "droewors",
  droëwors: "droewors", // handle diacritic variation
  sticks: "sticks",
  "thin sticks": "thin-sticks",
  "bacon biltong": "bacon-biltong",
  other: "other",
}

// Extra aliases seen in UI (with &). Falls back through here if needed.
const ALIASES: Record<string, string> = {
  "chops & steaks": "chops",
  "stew & stirfry & other": "stew-stirfry",
  "great for braai": "braai",
  "stew & potjiekos": "stew",
  "weeknight quick & easy": "quick",
  "bulk & hampers": "bulk",
  "deli & biltong": "deli-biltong",
  "spices & sauces": "spices-sauces",
  "bacon & ham": "bacon-ham",
  "wors & sausages": "wors-sausages",
  droëwors: "droewors",
}

/** Resolve a collection handle from any combination of menu titles. */
export function getCollectionHandle(categoryTitle?: string, itemTitle?: string, occasionTitle?: string): string {
  const candidates = [norm(itemTitle), norm(occasionTitle), norm(categoryTitle)].filter(Boolean) as string[]
  for (const k of candidates) if (COLLECTIONS[k]) return COLLECTIONS[k]
  // try aliases (e.g., with &)
  for (const raw of candidates) {
    const alias = ALIASES[raw] || ALIASES[raw?.replace(/and/g, "&") || ""]
    if (alias) return alias
  }
  return "all" // final fallback to /collections/all
}

/** For places that pass a single label (e.g., toShopHref("Sosaties")) */
export function toCollectionHref(label: string) {
  const handle = getCollectionHandle(undefined, label, undefined)
  return `/collections/${handle}`
}

// ===== Product href helpers =====
// 1) When you have just the product handle:
export const toProductHref = (handle: string) => `/products/${handle}`

// 2) When you only have some existing href like "/products/beef/steaks/fillet-portion":
export const normalizeProductHref = (href: string) => {
  try {
    const parts = href.split("/").filter(Boolean)
    const last = parts[parts.length - 1]
    return last ? `/products/${last}` : href
  } catch {
    return href
  }
}

// Back-compat: some code still imports toShopHref for collections
export const toShopHref = (label: string) => toCollectionHref(label)
