// nav/shop-links.ts
// Map menu labels → exact Shopify collection handles
const COLLECTION_LINKS: Record<string, string> = {
  Beef: "beef",
  Lamb: "lamb",
  Pork: "pork",
  Chicken: "chicken",
  Sosaties: "sosaties",
  Chops: "chops",
  "Stew & Stirfry": "stew-stirfry",
  "Deli & Biltong": "deli-biltong",
  "Ready to Braai": "ready-to-braai",
  // add more label→handle pairs here as you confirm them
}

// Keep existing imports/usages the same; just return direct collection URLs.
export const toShopHref = (label: string) => {
  const handle = COLLECTION_LINKS[label]
  return handle ? `/collections/${handle}` : "/collections/all"
}
