// nav/link-map.ts
export const COLLECTION_LINKS: Record<string, string> = {
  // collections you confirmed
  Sosaties: "sosaties",
  Chops: "chops",
  "Stew & Stirfry": "stew-stirfry",
  "Ready to Braai": "ready-to-braai",
  "Deli & Biltong": "deli-biltong",
}

export const toCollectionHref = (label: string) =>
  COLLECTION_LINKS[label] ? `/collections/${COLLECTION_LINKS[label]}` : "#"
