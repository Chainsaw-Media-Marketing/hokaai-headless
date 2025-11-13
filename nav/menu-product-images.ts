// List of product handles that should display images in the mega menu
// Based on the requirements: YES items get images, NO items remain text-only

import { menuProducts } from "./menu-product-handles"

// Extract all handles from menuProducts except Wors & Sausages (marked NO)
export const menuProductHandlesWithImages: string[] = [
  // Beef
  ...menuProducts["beef-steaks"].map((p) => p.handle),
  ...menuProducts["beef-ribs-brisket"].map((p) => p.handle),
  ...menuProducts["beef-roasts"].map((p) => p.handle),
  ...menuProducts["beef-mince-burgers"].map((p) => p.handle),
  ...menuProducts["beef-stew"].map((p) => p.handle),
  ...menuProducts["beef-oxtail"].map((p) => p.handle),
  ...menuProducts["beef-sosaties"].map((p) => p.handle),

  // Lamb
  ...menuProducts["lamb-chops"].map((p) => p.handle),
  ...menuProducts["lamb-ribs"].map((p) => p.handle),
  ...menuProducts["lamb-roasts"].map((p) => p.handle),
  ...menuProducts["lamb-stew"].map((p) => p.handle),
  ...menuProducts["lamb-sosaties"].map((p) => p.handle),
  ...menuProducts["lamb-bulk"].map((p) => p.handle),

  // Pork
  ...menuProducts["pork-chops"].map((p) => p.handle),
  ...menuProducts["pork-belly-ribs"].map((p) => p.handle),
  ...menuProducts["pork-roasts"].map((p) => p.handle),
  ...menuProducts["pork-stew"].map((p) => p.handle),
  ...menuProducts["pork-gammon"].map((p) => p.handle),
  ...menuProducts["pork-sosaties"].map((p) => p.handle),

  // Chicken
  ...menuProducts["chicken-whole"].map((p) => p.handle),
  ...menuProducts["chicken-cuts"].map((p) => p.handle),
  ...menuProducts["chicken-sosaties"].map((p) => p.handle),

  // Bacon Rashers & Ham
  ...menuProducts["bacon-ham"].map((p) => p.handle),

  // Deli & Biltong
  ...menuProducts["deli-biltong"].map((p) => p.handle),
  ...menuProducts["deli-droewors"].map((p) => p.handle),
  ...menuProducts["deli-sticks"].map((p) => p.handle),
  ...menuProducts["deli-thin-sticks"].map((p) => p.handle),
  ...menuProducts["deli-bacon-biltong"].map((p) => p.handle),
  ...menuProducts["deli-other"].map((p) => p.handle),

  // NOTE: Wors & Sausages products are excluded (marked NO in requirements)
]

// Helper function to check if a product handle should display an image
export function shouldDisplayImage(handle: string): boolean {
  return menuProductHandlesWithImages.includes(handle)
}
