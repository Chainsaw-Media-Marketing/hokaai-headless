// Mapping of mega menu categories to their specific products with titles and handles
// Based on the exact product organization in Shopify

export interface MenuProduct {
  title: string
  handle: string
}

export const menuProducts = {
  // Butchery > Beef > Steaks
  "beef-steaks": [
    { title: "Beef Fillet Portion", handle: "beef-fillet-portion" },
    { title: "Beef Picanha (Rump Cap)", handle: "beef-picanha" },
    { title: "Beef Ribeye Steak", handle: "beef-ribeye-steak" },
    { title: "Beef Rump Steak", handle: "beef-rump-steak" },
    { title: "Beef Sirloin", handle: "beef-sirloin" },
    { title: "Club Steak", handle: "club-steak" },
    { title: "Minute Steaks", handle: "minute-steaks" },
    { title: "Prego", handle: "prego" },
    { title: "T-Bone Steak", handle: "t-bone-steak" },
    { title: "Tenderised Steak", handle: "tenderised-steak" },
  ],

  // Butchery > Beef > Ribs & Rashers & Brisket & CHUCK
  "beef-ribs-brisket": [
    { title: "Beef Brisket Sliced", handle: "beef-brisket-sliced" },
    { title: "Deboned Beef Brisket", handle: "deboned-brisket" },
    { title: "Whole Beef Brisket", handle: "whole-brisket" },
    { title: "Beef Ribeye on the Bone", handle: "beef-ribeye-on-the-bone" },
    { title: "Beef Short Rib", handle: "beef-short-rib" },
    { title: "Whole Chuck", handle: "whole-chuck" },
    { title: "Beef Rashers", handle: "beef-rashers" },
  ],

  // Butchery > Beef > Roasts & Large Cuts
  "beef-roasts": [
    { title: "Silverside Roast", handle: "silverside-roast" },
    { title: "Topside Roast", handle: "topside-roast" },
    { title: "Beef Whole Fillet", handle: "beef-whole-fillet" },
  ],

  // Butchery > Beef > Mince & Burgers
  "beef-mince-burgers": [
    { title: "Lean Beef Mince", handle: "lean-beef-mince" },
    { title: "Topside Beef Mince", handle: "topside-beef-mince" },
    { title: "Beef Patties STANDARD (4×100g)", handle: "beef-patties-standard-4x100g" },
    { title: "Beef Patties LARGE (4×120g)", handle: "beef-patties-large-4x120g" },
    { title: "Beef Patties X-LARGE (4×150g)", handle: "beef-patties-x-large-4x150g" },
    { title: "Beef Patties XX-LARGE (2×250g)", handle: "beef-patties-xx-large-2x250g" },
  ],

  // Butchery > Beef > Stew & Stirfry & Other
  "beef-stew": [
    { title: "Beef Chuck Sliced", handle: "beef-chuck-sliced" },
    { title: "Beef Goulash", handle: "beef-goulash" },
    { title: "Beef Shin", handle: "beef-shin" },
    { title: "Beef Stew (Bone-in)", handle: "beef-stew-bone-in" },
    { title: "Beef Stew (Boneless)", handle: "beef-stew-boneless" },
    { title: "Beef Stirfry", handle: "beef-stirfry" },
  ],

  // Butchery > Beef > OXTAIL & Speciality
  "beef-oxtail": [
    { title: "Oxtail", handle: "oxtail" },
    { title: "Ox Tongue", handle: "ox-tongue" },
  ],

  // Butchery > Beef > Sosaties
  "beef-sosaties": [
    { title: "Beef Sosaties – BBQ", handle: "beef-sosaties-bbq" },
    { title: "Beef Sosaties – Red Wine & Garlic", handle: "beef-sosaties-red-wine-garlic" },
    { title: "Beef Sosaties – Sweet Curry", handle: "beef-sosaties-sweet-curry" },
    { title: "Beef Sosaties – Rump & Bacon (Sweet & Sour)", handle: "beef-sosaties-rump-bacon-sweet-sour" },
    { title: "Beef Sosaties – Smoked Brisket (Steakhouse)", handle: "beef-sosaties-smoked-brisket-steakhouse" },
  ],

  // Butchery > Lamb > Chops & Steaks
  "lamb-chops": [
    { title: "Lamb Leg Chops", handle: "lamb-leg-chops" },
    { title: "Lamb Loin Chops", handle: "lamb-loin-chops" },
    { title: "Lamb Rib Chops", handle: "lamb-rib-chops" },
    { title: "Lamb Shoulder Chops", handle: "lamb-shoulder-chops" },
  ],

  // Butchery > Lamb > Ribs
  "lamb-ribs": [
    { title: "Deboned Lamb Rib", handle: "deboned-lamb-rib" },
    { title: "Whole Lamb Rib", handle: "whole-lamb-rib" },
    { title: "Wind Dry Lamb Rib", handle: "wind-dry-lamb-rib" },
  ],

  // Butchery > Lamb > Roasts & Large Cuts
  "lamb-roasts": [
    { title: "Deboned Leg of Lamb", handle: "deboned-leg-of-lamb" },
    { title: "Whole Leg of Lamb", handle: "whole-leg-of-lamb" },
  ],

  // Butchery > Lamb > Stew & Pot Cuts
  "lamb-stew": [
    { title: "Lamb Neck", handle: "lamb-neck" },
    { title: "Lamb Potjiekos", handle: "lamb-potjiekos" },
    { title: "Lamb Shanks (350g)", handle: "lamb-shanks-350g" },
  ],

  // Butchery > Lamb > Sosaties
  "lamb-sosaties": [
    { title: "Lamb & Peach Sosaties (Sweet Curry)", handle: "lamb-and-peach-sosaties-sweet-curry" },
    { title: "Lamb Rib Sosaties – Sweet Curry", handle: "lamb-rib-sosaties-sweet-curry" },
  ],

  // Butchery > Lamb > Bulk/Whole
  "lamb-bulk": [
    { title: "Whole Lamb", handle: "whole-lamb" },
    { title: "Half Lamb", handle: "half-lamb" },
    { title: "Quarter Lamb Pack 6kg", handle: "quarter-lamb-pack-6kg" },
  ],

  // Butchery > Pork > Chops & Steaks
  "pork-chops": [
    { title: "Pork Neck Steak", handle: "pork-neck-steak" },
    { title: "Pork Loin Chops", handle: "pork-loin-chops" },
    { title: "Pork Shoulder Chops", handle: "pork-shoulder-chops" },
    { title: "Pork Leg Chops", handle: "pork-leg-chops" },
    { title: "Crumbed Pork Chops", handle: "crumbed-pork-chops" },
  ],

  // Butchery > Pork > Belly, Ribs & Rashers
  "pork-belly-ribs": [
    { title: "Pork Belly Deboned", handle: "pork-belly-deboned" },
    { title: "Pork Rashers", handle: "pork-rashers" },
    { title: "Pork Spare Ribs", handle: "pork-spare-ribs" },
    { title: "Deboned Pork Spare Ribs", handle: "deboned-pork-spare-ribs" },
  ],

  // Butchery > Pork > Roasts & Large Cuts
  "pork-roasts": [
    { title: "Deboned Pork Leg", handle: "deboned-pork-leg" },
    { title: "Pork Leg (Whole)", handle: "pork-leg-whole" },
    { title: "Pork Loin (Whole)", handle: "pork-loin-whole" },
    { title: "Pork Neck (Whole)", handle: "pork-neck-whole" },
    { title: "Pork Shoulder (Whole)", handle: "pork-shoulder-whole" },
  ],

  // Butchery > Pork > Stew & Stirfry
  "pork-stew": [
    { title: "Pork Goulash", handle: "pork-goulash" },
    { title: "Pork Stirfry", handle: "pork-stirfry" },
  ],

  // Butchery > Pork > Eisbein & Speciality
  "pork-eisbein": [{ title: "Pork Eisbein ( Smoked )", handle: "pork-eisbein-smoked" }],

  // Butchery > Pork > Gammon
  "pork-gammon": [{ title: "Deboned Gammon", handle: "deboned-gammon" }],

  // Butchery > Pork > Sosaties
  "pork-sosaties": [{ title: "Pork Neck Sosaties (Sweet & Sour)", handle: "pork-neck-sosaties-sweet-sour" }],

  // Butchery > Chicken > Whole & Flatties
  "chicken-whole": [{ title: "Whole Chicken (±2.3 kg)", handle: "whole-chicken-1-2kg" }],

  // Butchery > Chicken > Cuts
  "chicken-cuts": [
    { title: "Chicken Drumsticks", handle: "chicken-drumsticks" },
    { title: "Chicken Drummets", handle: "chicken-drummets" },
    { title: "Chicken Thighs", handle: "chicken-thighs" },
    { title: "Chicken Wings", handle: "chicken-wings" },
    { title: "Chicken Fillets", handle: "chicken-fillets" },
    { title: "Chicken Star Pack", handle: "chicken-star-pack" },
  ],

  // Butchery > Chicken > Sosaties
  "chicken-sosaties": [
    { title: "Chicken Sosaties – BBQ", handle: "chicken-sosaties-bbq" },
    { title: "Chicken Sosaties – Honey & Mustard", handle: "chicken-sosaties-honey-mustard" },
    { title: "Chicken Sosaties – Lemon & Herb", handle: "chicken-sosaties-lemon-herb" },
    { title: "Chicken Sosaties – Chicken & Bacon (Sweet & Sour)", handle: "chicken-sosaties-chicken-bacon-sweet-sour" },
    { title: "Chicken Sosaties – Mango & Chutney", handle: "chicken-sosaties-mango-chutney" },
  ],

  // Butchery > Wors & Sausages
  "wors-sausages": [
    { title: "Thin Chilli Boerewors", handle: "thin-chilli-boerewors" },
    { title: "Chutney Boerewors", handle: "chutney-boerewors" },
    { title: "Double Tangy Cheesegriller", handle: "double-tangy-cheesegriller" },
    { title: "Thin Double Tangy Cheesegriller", handle: "thin-double-tangy-cheesegriller" },
    { title: "Thick Cheese Wors", handle: "thick-cheese-wors" },
    { title: "Thin Cheese Wors", handle: "thin-cheese-wors" },
    { title: "Just Beef Boerewors", handle: "just-beef-boerewors" },
    { title: "Thin Just Beef Boerewors", handle: "thin-just-beef-boerewors" },
    { title: "Thin Sheep Boerewors", handle: "thin-sheep-boerewors" },
    { title: "Thin Watertand Boerewors", handle: "thin-watertand-boerewors" },
    { title: "Watertand Boerewors", handle: "watertand-boerewors" },
    { title: "Watertand Boerewors Bulk", handle: "watertand-boerewors-bulk" },
    { title: "Ouma Boerewors", handle: "ouma-boerewors" },
    { title: "Sosatie Wors", handle: "sosatie-wors" },
    { title: "Spekwors Boerewors", handle: "spekwors-boerewors" },
  ],

  // Butchery > Bacon Rashers & Ham
  "bacon-ham": [
    { title: "Streaky Bacon", handle: "streaky-bacon" },
    { title: "Beef Rashers", handle: "beef-rashers" },
    { title: "Deboned Gammon", handle: "deboned-gammon" },
  ],

  // Deli & Biltong > Biltong
  "deli-biltong": [
    { title: "Biltong", handle: "biltong" },
    { title: "Chilli Biltong", handle: "chilli-biltong" },
    { title: "Chutney Biltong", handle: "chutney-biltong" },
    { title: "Lemon Pepper Biltong", handle: "lemon-pepper-biltong" },
    { title: "Babalas Biltong", handle: "babalas-biltong" },
  ],

  // Deli & Biltong > Droëwors
  "deli-droewors": [
    { title: "Original Droëwors", handle: "original-droewors" },
    { title: "Chilli Droëwors", handle: "chilli-droewors" },
    { title: "Fat Free Droewors", handle: "fat-free-droewors" },
    { title: "Flat Droëwors", handle: "flat-droewors" },
    { title: "Banting Friendly Droewors", handle: "banting-friendly-droewors" },
    { title: "Wagyu Droëwors", handle: "wagyu-droewors" },
  ],

  // Deli & Biltong > Sticks
  "deli-sticks": [
    { title: "BBQ Sticks", handle: "bbq-sticks" },
    { title: "Chilli Sticks", handle: "chilli-sticks" },
    { title: "Thai Sweet Chilli Sticks", handle: "thai-sweet-chilli-sticks" },
  ],

  // Deli & Biltong > Thin Sticks
  "deli-thin-sticks": [
    { title: "Droëwors Thin Sticks", handle: "drywors-thin-sticks" },
    { title: "Chilli Droëwors Thin Sticks", handle: "chilli-drywors-thin-sticks" },
    { title: "Salami Thin Sticks", handle: "salami-thin-sticks" },
    { title: "Venison Thin Sticks", handle: "venison-thin-sticks" },
  ],

  // Deli & Biltong > Bacon Biltong
  "deli-bacon-biltong": [
    { title: "Honey Bacon Biltong", handle: "honey-bacon-biltong" },
    { title: "Chilli Bacon Biltong", handle: "chilli-bacon-biltong" },
    { title: "Lemon Pepper Bacon Biltong", handle: "lemon-pepper-bacon-biltong" },
  ],

  // Deli & Biltong > Other
  "deli-other": [
    { title: "Biltong Skille (Crumbs)", handle: "biltong-skille-crumbs" },
    { title: "Biltong Wagon Wheels", handle: "biltong-wagon-wheels" },
    { title: "Cabanossi", handle: "cabanossi" },
    { title: "Home-made Salami", handle: "salami" },
    { title: "Salami Sticks", handle: "salami-sticks" },
    { title: "Pork Crackling", handle: "pork-crackling" },
    { title: "Poeier Biltong (Powder)", handle: "poeier-biltong-powder" },
  ],

  // Butchery > Hampers & Value Packs products
  hampers: [
    { title: "Cyber Hamper", handle: "cyber-hamper" },
    { title: "Meat Hamper – Braai Pack", handle: "meat-hamper-braai-pack" },
    { title: "Meat Hamper – Economical Pack", handle: "meat-hamper-economical-pack" },
    { title: "Meat Hamper – Jukskei", handle: "meat-hamper-jukskei" },
    { title: "Meat Hamper – Ossewa", handle: "meat-hamper-ossewa" },
    { title: "Meat Hamper – Randsaver Pack", handle: "meat-hamper-randsaver-pack-2" },
    { title: "Meat Hamper – Saver Pack", handle: "meat-hamper-saver-pack" },
    { title: "Meat Hamper – Super Pack", handle: "meat-hamper-super-pack" },
    { title: "Meat Hamper – Sweep", handle: "meat-hamper-sweep" },
    { title: "Meat Hamper – Voortrekker", handle: "meat-hamper-voortrekker" },
  ],
} as const

export type MenuProductCategory = keyof typeof menuProducts

// Legacy export for backwards compatibility (handles only)
export const menuProductHandles = Object.fromEntries(
  Object.entries(menuProducts).map(([key, products]) => [key, products.map((p) => p.handle)]),
) as Record<MenuProductCategory, string[]>

export const viewAllUrls: { [key: string]: string } = {
  "View All Whole Chicken": "/collections/butchery?department=butchery&cut_family=whole-bird",
}
