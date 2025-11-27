"use client"

import type React from "react"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import type { NavItem, MegaMenuProps } from "@/lib/types"
import { normalizeProductHref } from "@/nav/collection-handles"
import { menuProducts } from "@/nav/menu-product-handles"
import { getViewAllUrlFromMapping } from "@/lib/view-all-mappings"
import { getOccasionItemUrl, buildMultiOccasionUrl } from "@/lib/occasion-mappings"
import { useRouter } from "next/navigation"

const MEGAMENU_IMAGE_MAP: Record<string, string> = {
  // Existing 38 products
  "beef-fillet-portion": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Fillet-Steak.jpg?v=1761123642",
  "beef-picanha": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFPICANHA.jpg?v=1761129738",
  "beef-ribeye-steak": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Rib-eye-Steak.jpg?v=1761123659",
  "beef-rump-steak": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Rump-Steak.jpg?v=1761123664",
  "beef-sirloin": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Sirloin-Steak.jpg?v=1761123662",
  "club-steak": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CLUBSTEAK.jpg?v=1761129708",
  "minute-steaks": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/MINUTESTEAKS.jpg?v=1761129232",
  prego: "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Prego-Steak.jpg?v=1761123633",
  "t-bone-steak": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/T-bone-Steak-300x300.jpg?v=1761123644",
  "tenderised-steak": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Tenderised-Steak.jpg?v=1761123630",
  "lamb-leg-chops": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Lamb-Leg-Chops.jpg?v=1761123626",
  "lamb-loin-chops": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Lamb-Loin-Chops.jpg?v=1761123628",
  "lamb-rib-chops": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Lamb-Rib-Chops.jpg?v=1761123622",
  "lamb-shoulder-chops": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Lamb-Shoulder-Chops.jpg?v=1761123624",
  "deboned-leg-of-lamb": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Deboned-Leg-of-Lamb.jpg?v=1761123618",
  "whole-leg-of-lamb": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Whole-Leg-of-lamb.jpg?v=1761123620",
  "lamb-neck": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/LAMBNECK.jpg?v=1761126905",
  "lamb-shanks-350g": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Lamb-Shanks.jpg?v=1761123566",
  "pork-neck-steak": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Neck-Steak.jpg?v=1761123615",
  "pork-loin-chops": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Loin-Chops.jpg?v=1761123601",
  "pork-shoulder-chops": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Shoulder-Chops.jpg?v=1761123599",
  "pork-leg-chops": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Leg-Chops.jpg?v=1761123596",
  "pork-belly-deboned": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Belly.jpg?v=1761123496",
  "pork-rashers": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Rashers.jpg?v=1761123525",
  "pork-spare-ribs": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Spareribs-Bone-in.jpg?v=1761123562",
  "pork-loin-whole": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/PORKLOINWHOLE.jpg?v=1761129054",
  "pork-neck-whole": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Neck-Whole.jpg?v=1761123610",
  "pork-shoulder-whole": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/PORKSHOULDERWHOLE.jpg?v=1761128574",
  "pork-goulash": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Goulash.jpg?v=1761123554",
  "whole-chicken-1-2kg": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Whole-Chicken.jpg?v=1761123514",
  "chicken-drumsticks": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Chicken-Drumsticks.jpg?v=1761123508",
  "chicken-thighs": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Chicken-Thighs.jpg?v=1761123516",
  "chicken-wings": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Chicken-Wings.jpg?v=1761123504",
  "chicken-fillets": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Chicken-Fillet.jpg?v=1761123502",
  "streaky-bacon": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Eskort-Streaky-Bacon-1kg.jpg?v=1761123523",
  "beef-rashers": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Rashers.jpg?v=1761123518",
  biltong: "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BILTONGDEFAULT.jpg?v=1761128250",
  "original-droewors": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/ORIGINALDRYWORS.jpg?v=1761127889",

  // New 91 products from fetch-missing-menu-images.js
  "beef-brisket-sliced": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Brisket.jpg?v=1761123649",
  "deboned-brisket": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/DEBONEDBEEFBRISKET.jpg?v=1761129282",
  "whole-brisket": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/WHOLEBEEFBRISKET.jpg?v=1761129316",
  "beef-ribeye-on-the-bone":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Rib-eye-on-the-bone.jpg?v=1761123647",
  "beef-short-rib": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Short-Rib.jpg?v=1761123652",
  "whole-chuck": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHUCKWHOLE.jpg?v=1761129189",
  "silverside-roast": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/SILVERSIDEROAST.jpg?v=1761129677",
  "topside-roast": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/TOPSIDEROAST.jpg?v=1761129648",
  "beef-whole-fillet": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Fillet-Whole.jpg?v=1761123656",
  "lean-beef-mince": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Lean-Beef-Mince.jpg?v=1761123640",
  "topside-beef-mince": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Topside-Beef-Mince.jpg?v=1761123638",
  "beef-patties-standard-4x100g":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFPATTIESSTANDARD4x100g.jpg?v=1761129619",
  "beef-patties-large-4x120g":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFPATTIESL4x120g.jpg?v=1761129584",
  "beef-patties-x-large-4x150g":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFPATTIESX-L4x150g.jpg?v=1761129556",
  "beef-patties-xx-large-2x250g":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFPATTIESXX-L2x250g.jpg?v=1761129521",
  "beef-chuck-sliced": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Chuck.jpg?v=1761123577",
  "beef-goulash": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Goulash.jpg?v=1761123575",
  "beef-shin": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Shin.jpg?v=1761123581",
  "beef-stew-bone-in": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Stew-Bone-In.jpg?v=1761123583",
  "beef-stew-boneless": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Bonesless-Beef-Stew.jpg?v=1761123585",
  "beef-stirfry": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-Stirfry.jpg?v=1761123654",
  oxtail: "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Beef-oxtail.jpg?v=1761123579",
  "ox-tongue": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pickled-Ox-Tongue.jpg?v=1761123573",
  "beef-sosaties-bbq": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFSOSATIES-BBQ.jpg?v=1761129489",
  "beef-sosaties-red-wine-garlic":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFSOSATIES-REDWINE_GARLIC.jpg?v=1761129461",
  "beef-sosaties-sweet-curry":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFSOSATIES-SWEETCURRY.jpg?v=1761129437",
  "beef-sosaties-rump-bacon-sweet-sour":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFSOSATIES-RUMP_BACON_SWEET_SOUR.jpg?v=1761129404",
  "beef-sosaties-smoked-brisket-steakhouse":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BEEFSOSATIES-SMOKEDBRISKET.jpg?v=1761129368",
  "deboned-lamb-rib": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/DEBONEDLAMBRIB.jpg?v=1761126946",
  "whole-lamb-rib":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Whole-lamb-Rib_fa2f245e-7807-4148-bd61-9b06c19e3f45.jpg?v=1761123571",
  "wind-dry-lamb-rib": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Whole-lamb-Rib.jpg?v=1761123568",
  "lamb-potjiekos": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Lamb-Stew.jpg?v=1761123564",
  "lamb-and-peach-sosaties-sweet-curry":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/LAMB_PEACHSOSATIES_SWEETCURRY.jpg?v=1761129101",
  "lamb-rib-sosaties-sweet-curry":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/LAMBRIBSOSATIES-SWEETCURRY.jpg?v=1761129144",
  "whole-lamb": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Whole-Lamb.jpg?v=1761123552",
  "half-lamb": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/HALFLAMB.jpg?v=1761126860",
  "quarter-lamb-pack-6kg": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Quarter-Lamb-Pack.jpg?v=1761123549",
  "crumbed-pork-chops": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Crumbed-Pork-Chops.jpg?v=1761123612",
  "deboned-pork-spare-ribs":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Deboned-Pork-Spareribs.jpg?v=1761123559",
  "deboned-pork-leg": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Deboned-Leg-Of-Pork.jpg?v=1761123608",
  "pork-leg-whole": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Leg-of-Pork-bone-in.jpg?v=1761123605",
  "pork-stirfry": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Stir-Fry.jpg?v=1761123603",
  "pork-eisbein-smoked": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Pork-Eisbein.jpg?v=1761123499",
  "pork-neck-sosaties-sweet-sour":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/PORKNECKSOSATIESSWEETANDSOUR.jpg?v=1761128543",
  "chicken-flatties": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Chicken-Flattie.jpg?v=1761123512",
  "chicken-drummets": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Chicken-drummets-1.jpg?v=1761123506",
  "chicken-star-pack": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHICKENSTARPACK.jpg?v=1761128318",
  "chicken-sosaties-bbq": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHICKENSOSATIES-BBQ.jpg?v=1761128507",
  "chicken-sosaties-honey-mustard":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHICKENSOSATIES-HONEY_MUSTARD.jpg?v=1761128470",
  "chicken-sosaties-lemon-herb":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHICKENSOSATIES-LEMON_HERB.jpg?v=1761128439",
  "chicken-sosaties-chicken-bacon-sweet-sour":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHICKENSOSATIES-Chicken_Bacon_Sweet_Sour.jpg?v=1761128404",
  "chicken-sosaties-mango-chutney":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHICKENSOSATIES-MANGO_CHUTNEY.jpg?v=1761128351",
  "deboned-gammon": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Deboned-Gammon.jpg?v=1761123521",
  "chilli-biltong": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHILLIBILTONG.jpg?v=1761128035",
  "chutney-biltong": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHUTNEYBILTONG.jpg?v=1761128216",
  "lemon-pepper-biltong": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/LEMONPEPPERBILTONG.jpg?v=1761128153",
  "babalas-biltong": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BABALASBILTONG.jpg?v=1761128003",
  "chilli-droewors": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHILLIDRYWORS.jpg?v=1761127776",
  "fat-free-droewors": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/FATFREEDRYWORS.jpg?v=1761127691",
  "flat-droewors": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/FLATDRYWORS.jpg?v=1761127806",
  "banting-friendly-droewors":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BANTINGFRIENDLYDRYWORS.jpg?v=1761127842",
  "wagyu-droewors": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/WAGYUDRYWORS.jpg?v=1761127745",
  "bbq-sticks": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BBQSTICKS.jpg?v=1761127659",
  "chilli-sticks": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHILLISTICKS.jpg?v=1761127599",
  "thai-sweet-chilli-sticks":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/THAISWEETCHILLISTICKS.jpg?v=1761127629",
  "drywors-thin-sticks": "/images/drywors-20thin-20sticks.jpg",
  "chilli-drywors-thin-sticks": "/images/chilli-20drywors-20thin-20sticks.jpg",
  "salami-thin-sticks": "/images/salami-20thin-20sticks.jpg",
  "venison-thin-sticks": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/VENISONTHINSTICKS.jpg?v=1761127284",
  "honey-bacon-biltong": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/HONEYBACONBILTONG.jpg?v=1761127235",
  "chilli-bacon-biltong":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/CHILLIBACONBILTONG_322dbc7b-1af5-4343-84f4-200d56e935c4.jpg?v=1761127134",
  "lemon-pepper-bacon-biltong":
    "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/LEMONPEPPERBACONBILTONG.jpg?v=1761127182",
  "biltong-skille-crumbs": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BILTONGCRUMBS.jpg?v=1761127942",
  "biltong-wagon-wheels": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/BILTONGWAGONWHEELS.jpg?v=1761127975",
  cabanossi: "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/Cabanossi.jpg?v=1761123588",
  salami: "/images/salami-20homemade.jpg",
  "salami-sticks": "/images/salami-20sticks.jpg",
  "pork-crackling": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/PORKCRACKLING.jpg?v=1761123743",
  "poeier-biltong-powder": "https://cdn.shopify.com/s/files/1/0940/4763/3771/files/POWDERBILTONG.jpg?v=1761126982",
}

const isCategory = (item: NavItem): boolean => {
  // Primary signals: has submenu (children items)
  return !!(item.items && item.items.length > 0)
}

const isProduct = (item: NavItem): boolean => {
  // Product: no submenu and has href
  return !isCategory(item) && !!item.href
}

const shouldUseViewAllUrl = (item: NavItem, categoryTitle: string): boolean => {
  // Items without href and without children should use View All filter URLs
  // This applies to Spices & Sauces, Braai Gear, and Groceries submenu items
  return (
    !item.href &&
    !item.items &&
    (categoryTitle === "Spices & Sauces" || categoryTitle === "Braai Gear" || categoryTitle === "Groceries")
  )
}

const getProductUrl = (item: NavItem): string => {
  if (item.href) {
    const handle = normalizeProductHref(item.href).replace("/products/", "")
    return `/products/${handle}`
  }
  const handle = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `/products/${handle}`
}

const getCategoryFilters = (categoryTitle: string, subcategoryTitle?: string, occasionTitle?: string) => {
  const filters: { meat_type?: string; cut_family?: string; occasion?: string[] } = {}

  if (occasionTitle) {
    // Map occasion titles to filter values
    const occasionMap: { [key: string]: string } = {
      "Great for Braai": "Braai",
      "Great for Stew & Potjiekos": "Stew",
      "Great for Roasts": "Roasts",
      "Weeknight Quick & Easy": "Quick",
      "Ready to Braai (Marinated & Flavoured)": "ReadyToBraai",
      "Bulk & Hampers": "Bulk",
    }
    const occasion = occasionMap[occasionTitle] || occasionTitle.replace(/[^a-zA-Z0-9]/g, "")
    filters.occasion = [occasion]
  } else {
    // Map main categories to meat_type filter
    const meatTypeMap: { [key: string]: string } = {
      Beef: "Beef",
      Lamb: "Lamb",
      Pork: "Pork",
      Chicken: "Chicken",
      "Wors & Sausages": "Wors & Sausages",
      Sosaties: "Sosaties",
      "Bacon Rashers & Ham": "Bacon Rashers & Ham",
      "Hampers & Value Packs": "Hampers",
      "Deli & Biltong": "Deli & Biltong",
      "Spices & Sauces": "Spices",
      "Braai Gear": "BraaiGear",
      Groceries: "Groceries",
    }

    if (meatTypeMap[categoryTitle]) {
      filters.meat_type = meatTypeMap[categoryTitle]
    }

    // Add subcategory as cut_family filter if provided
    if (subcategoryTitle) {
      const cutFamilyMap: { [key: string]: string } = {
        Steaks: "Steaks",
        "Ribs & Rashers & Brisket & CHUCK": "Ribs",
        "Roasts & Large Cuts": "Roasts",
        "Mince & Burgers": "Mince",
        "Stew & Stirfry & Other": "Stew",
        "OXTAIL & Speciality": "Oxtail",
        "Chops & Steaks": "Chops",
        Ribs: "Ribs",
        "Stew & Pot Cuts": "Stew",
        "Belly, Ribs & Rashers": "Belly",
        "Eisbein & Specialty": "Eisbein",
        Gammon: "Gammon",
        "Whole & Flatties": "Whole",
        Cuts: "Cuts",
        "Bulk/Whole": "Bulk",
        Biltong: "Biltong",
        Droëwors: "Droewors",
        Sticks: "Sticks",
        "Thin Sticks": "ThinSticks",
        "Bacon Biltong": "BaconBiltong",
        Other: "Other",
      }

      if (cutFamilyMap[subcategoryTitle]) {
        filters.cut_family = cutFamilyMap[subcategoryTitle]
      }
    }
  }

  return filters
}

const getViewAllUrl = (categoryTitle: string, meatType?: string, subcategoryTitle?: string): string => {
  // Build the key for the static mapping
  let key = `View All ${categoryTitle}`

  if (meatType && subcategoryTitle) {
    if (meatType === "Chicken" && subcategoryTitle === "Whole") {
      key = "View All Whole Chicken"
    } else {
      // Subcategory level: "View All Beef → Steaks"
      key = `View All ${meatType} → ${subcategoryTitle}`
    }
  } else if (meatType) {
    // Meat type level: "View All Beef"
    key = `View All ${meatType}`
  } else if (subcategoryTitle) {
    // Direct subcategory: "View All Biltong"
    key = `View All ${subcategoryTitle}`
  }

  return getViewAllUrlFromMapping(key)
}

export function MegaMenu({
  items,
  title,
  onClose,
  beefProducts = [],
  lambProducts = [],
  porkProducts = [],
  chickenProducts = [],
  biltongProducts = [],
  droeworsProducts = [],
  sticksProducts = [],
  thinSticksProducts = [],
  baconBiltongProducts = [],
  otherDeliProducts = [],
}: MegaMenuProps) {
  const [hoveredLevel1, setHoveredLevel1] = useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [hoveredDeli, setHoveredDeli] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ [key: string]: { top?: number; bottom?: number } }>({})
  const [dropdownColumns, setDropdownColumns] = useState<{ [key: string]: number }>({})
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const categoryEnterTimerRef = useRef<NodeJS.Timeout | null>(null)
  const categoryLeaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const deliEnterTimerRef = useRef<NodeJS.Timeout | null>(null)
  const deliLeaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const productEnterTimerRef = useRef<NodeJS.Timeout | null>(null)
  const productLeaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const level1EnterTimerRef = useRef<NodeJS.Timeout | null>(null)
  const level1LeaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  const handleShopAllClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
    router.push("/collections/all?page=1")
  }

  // No productImages state, no useEffect, no API calls

  const getProductsForMenu = (categoryTitle: string, meatType: string, subcategoryTitle: string) => {
    // Direct mapping - NO dynamic generation
    if (categoryTitle === "Butchery") {
      if (meatType === "Beef") {
        if (subcategoryTitle === "Steaks") return menuProducts["beef-steaks"]
        if (subcategoryTitle === "Ribs & Rashers & Brisket & CHUCK") return menuProducts["beef-ribs-brisket"]
        if (subcategoryTitle === "Roasts & Large Cuts") return menuProducts["beef-roasts"]
        if (subcategoryTitle === "Mince & Burgers") return menuProducts["beef-mince-burgers"]
        if (subcategoryTitle === "Stew & Stirfry & Other") return menuProducts["beef-stew"]
        if (subcategoryTitle === "OXTAIL & Speciality") return menuProducts["beef-oxtail"]
        if (subcategoryTitle === "Sosaties") return menuProducts["beef-sosaties"]
      }
      if (meatType === "Lamb") {
        if (subcategoryTitle === "Chops & Steaks") return menuProducts["lamb-chops"]
        if (subcategoryTitle === "Ribs") return menuProducts["lamb-ribs"]
        if (subcategoryTitle === "Roasts & Large Cuts") return menuProducts["lamb-roasts"]
        if (subcategoryTitle === "Stew & Pot Cuts") return menuProducts["lamb-stew"]
        if (subcategoryTitle === "Bulk/Whole") return menuProducts["lamb-bulk"]
        if (subcategoryTitle === "Sosaties") return menuProducts["lamb-sosaties"]
      }
      if (meatType === "Pork") {
        if (subcategoryTitle === "Chops & Steaks") return menuProducts["pork-chops"]
        if (subcategoryTitle === "Belly, Ribs & Rashers") return menuProducts["pork-belly-ribs"]
        if (subcategoryTitle === "Roasts & Large Cuts") return menuProducts["pork-roasts"]
        if (subcategoryTitle === "Stew & Stirfry") return menuProducts["pork-stew"]
        if (subcategoryTitle === "Gammon") return menuProducts["pork-gammon"]
        if (subcategoryTitle === "Sosaties") return menuProducts["pork-sosaties"]
      }
      if (meatType === "Chicken") {
        if (subcategoryTitle === "Whole") return menuProducts["chicken-whole"]
        if (subcategoryTitle === "Cuts") return menuProducts["chicken-cuts"]
        if (subcategoryTitle === "Sosaties") return menuProducts["chicken-sosaties"]
      }
      if (meatType === "Wors & Sausages") {
        return menuProducts["wors-sausages"]
      }
      if (meatType === "Bacon Rashers & Ham") {
        return menuProducts["bacon-ham"]
      }
      if (meatType === "Hampers & Value Packs") {
        return menuProducts["hampers"]
      }
      if (meatType === "Sosaties") {
        if (subcategoryTitle === "Beef") return menuProducts["beef-sosaties"]
        if (subcategoryTitle === "Lamb") return menuProducts["lamb-sosaties"]
        if (subcategoryTitle === "Pork") return menuProducts["pork-sosaties"]
        if (subcategoryTitle === "Chicken") return menuProducts["chicken-sosaties"]
      }
    }
    if (categoryTitle === "Sosaties") {
      if (meatType === "Beef") return menuProducts["beef-sosaties"]
      if (meatType === "Lamb") return menuProducts["lamb-sosaties"]
      if (meatType === "Pork") return menuProducts["pork-sosaties"]
      if (meatType === "Chicken") return menuProducts["chicken-sosaties"]
    }
    if (categoryTitle === "Deli & Biltong") {
      if (subcategoryTitle === "Biltong") return menuProducts["deli-biltong"]
      if (subcategoryTitle === "Droëwors") return menuProducts["deli-droewors"]
      if (subcategoryTitle === "Sticks") return menuProducts["deli-sticks"]
      if (subcategoryTitle === "Thin Sticks") return menuProducts["deli-thin-sticks"]
      if (subcategoryTitle === "Bacon Biltong") return menuProducts["deli-bacon-biltong"]
      if (subcategoryTitle === "Other") return menuProducts["deli-other"]
    }
    return null
  }

  const calculateOptimalColumns = (itemCount: number, megaMenuHeight: number, triggerOffsetFromTop: number) => {
    return 2 // Always use 2 columns for better spacing with images
  }

  useEffect(() => {
    if (hoveredCategory && megaMenuRef.current) {
      const megaMenuRect = megaMenuRef.current.getBoundingClientRect()
      const triggerElement = document.querySelector(`[data-trigger="${hoveredCategory}"]`)

      if (triggerElement) {
        const triggerRect = triggerElement.getBoundingClientRect()
        const dropdownKey = hoveredCategory
        const dropdownElement = dropdownRefs.current[dropdownKey]

        if (dropdownElement) {
          dropdownElement.style.visibility = "hidden"
          dropdownElement.style.display = "block"
          const dropdownHeight = dropdownElement.scrollHeight
          dropdownElement.style.visibility = ""
          dropdownElement.style.display = ""

          const megaMenuHeight = megaMenuRect.height
          const triggerOffsetFromTop = triggerRect.top - megaMenuRect.top

          if (dropdownHeight >= megaMenuHeight - 20) {
            setDropdownPosition((prev) => ({
              ...prev,
              [dropdownKey]: { top: -triggerOffsetFromTop + 10 },
            }))
          } else {
            const spaceBelow = megaMenuHeight - triggerOffsetFromTop - 20
            if (dropdownHeight <= spaceBelow) {
              setDropdownPosition((prev) => ({
                ...prev,
                [dropdownKey]: { top: 0 },
              }))
            } else {
              setDropdownPosition((prev) => ({
                ...prev,
                [dropdownKey]: { top: megaMenuHeight - triggerOffsetFromTop - dropdownHeight - 10 },
              }))
            }
          }
        }
      }
    }
  }, [hoveredCategory])

  useEffect(() => {
    if (hoveredProduct && megaMenuRef.current) {
      const megaMenuRect = megaMenuRef.current.getBoundingClientRect()
      const triggerElement = document.querySelector(`[data-product-trigger="${hoveredProduct}"]`)

      if (triggerElement) {
        const triggerRect = triggerElement.getBoundingClientRect()
        const dropdownKey = hoveredProduct

        const categoryData = items.find((cat) => hoveredProduct.includes(cat.title))
        if (categoryData) {
          const itemData = categoryData.items?.find((item) => hoveredProduct.includes(item.title))
          const subItemData = itemData?.items?.find((subItem) => hoveredProduct.includes(subItem.title))
          if (subItemData?.items) {
            const itemCount = subItemData.items.length
            const triggerOffsetFromTop = triggerRect.top - megaMenuRect.top
            const optimalColumns = calculateOptimalColumns(itemCount, megaMenuRect.height, triggerOffsetFromTop)
            setDropdownColumns((prev) => ({ ...prev, [dropdownKey]: optimalColumns }))
          }
        }

        const dropdownElement = dropdownRefs.current[dropdownKey]

        if (dropdownElement) {
          dropdownElement.style.visibility = "hidden"
          dropdownElement.style.display = "block"
          const dropdownHeight = dropdownElement.scrollHeight
          dropdownElement.style.visibility = ""
          dropdownElement.style.display = ""

          const megaMenuHeight = megaMenuRect.height
          const triggerOffsetFromMegaMenu = triggerRect.top - megaMenuRect.top

          if (dropdownHeight >= megaMenuHeight - 20) {
            setDropdownPosition((prev) => ({
              ...prev,
              [dropdownKey]: { top: -triggerOffsetFromMegaMenu + 10 },
            }))
          } else {
            const spaceBelow = megaMenuHeight - triggerOffsetFromMegaMenu - 20
            if (dropdownHeight <= spaceBelow) {
              setDropdownPosition((prev) => ({
                ...prev,
                [dropdownKey]: { top: 0 },
              }))
            } else {
              setDropdownPosition((prev) => ({
                ...prev,
                [dropdownKey]: { top: megaMenuHeight - triggerOffsetFromMegaMenu - dropdownHeight - 10 },
              }))
            }
          }
        }
      }
    }
  }, [hoveredProduct, items])

  useEffect(() => {
    if (hoveredDeli && megaMenuRef.current) {
      const megaMenuRect = megaMenuRef.current.getBoundingClientRect()
      const triggerElement = document.querySelector(`[data-deli-trigger="${hoveredDeli}"]`)

      if (triggerElement) {
        const triggerRect = triggerElement.getBoundingClientRect()
        const dropdownKey = hoveredDeli

        const categoryData = items.find((cat) => hoveredDeli.includes(cat.title))
        if (categoryData) {
          const itemData = categoryData.items?.find((item) => hoveredDeli.includes(item.title))
          if (itemData?.items) {
            const itemCount = itemData.items.length
            const triggerOffsetFromTop = triggerRect.top - megaMenuRect.top
            const optimalColumns = calculateOptimalColumns(itemCount, megaMenuRect.height, triggerOffsetFromTop)
            setDropdownColumns((prev) => ({ ...prev, [dropdownKey]: optimalColumns }))
          }
        }

        const dropdownElement = dropdownRefs.current[dropdownKey]

        if (dropdownElement) {
          dropdownElement.style.visibility = "hidden"
          dropdownElement.style.display = "block"
          const dropdownHeight = dropdownElement.scrollHeight
          dropdownElement.style.visibility = ""
          dropdownElement.style.display = ""

          const megaMenuHeight = megaMenuRect.height
          const triggerOffsetFromTop = triggerRect.top - megaMenuRect.top

          if (dropdownHeight >= megaMenuHeight - 20) {
            setDropdownPosition((prev) => ({
              ...prev,
              [dropdownKey]: { top: -triggerOffsetFromTop + 10 },
            }))
          } else {
            const spaceBelow = megaMenuHeight - triggerOffsetFromTop - 20
            if (dropdownHeight <= spaceBelow) {
              setDropdownPosition((prev) => ({
                ...prev,
                [dropdownKey]: { top: 0 },
              }))
            } else {
              setDropdownPosition((prev) => ({
                ...prev,
                [dropdownKey]: { top: megaMenuHeight - triggerOffsetFromTop - dropdownHeight - 10 },
              }))
            }
          }
        }
      }
    }
  }, [hoveredDeli, items])

  const handleCategoryHoverEnter = (categoryKey: string) => {
    // Cancel any pending leave
    if (categoryLeaveTimerRef.current) {
      clearTimeout(categoryLeaveTimerRef.current)
      categoryLeaveTimerRef.current = null
    }

    // Cancel any pending enter
    if (categoryEnterTimerRef.current) {
      clearTimeout(categoryEnterTimerRef.current)
    }

    // Schedule the switch after 180ms
    categoryEnterTimerRef.current = setTimeout(() => {
      setHoveredCategory(categoryKey)
      categoryEnterTimerRef.current = null
    }, 180)
  }

  const handleCategoryHoverLeave = () => {
    // Cancel any pending enter
    if (categoryEnterTimerRef.current) {
      clearTimeout(categoryEnterTimerRef.current)
      categoryEnterTimerRef.current = null
    }

    // Cancel any pending leave
    if (categoryLeaveTimerRef.current) {
      clearTimeout(categoryLeaveTimerRef.current)
    }

    // Schedule clearing after 120ms grace period
    categoryLeaveTimerRef.current = setTimeout(() => {
      setHoveredCategory(null)
      categoryLeaveTimerRef.current = null
    }, 120)
  }

  const handleDeliHoverEnter = (deliKey: string) => {
    if (deliLeaveTimerRef.current) {
      clearTimeout(deliLeaveTimerRef.current)
      deliLeaveTimerRef.current = null
    }

    if (deliEnterTimerRef.current) {
      clearTimeout(deliEnterTimerRef.current)
    }

    deliEnterTimerRef.current = setTimeout(() => {
      setHoveredDeli(deliKey)
      deliEnterTimerRef.current = null
    }, 180)
  }

  const handleDeliHoverLeave = () => {
    if (deliEnterTimerRef.current) {
      clearTimeout(deliEnterTimerRef.current)
      deliEnterTimerRef.current = null
    }

    if (deliLeaveTimerRef.current) {
      clearTimeout(deliLeaveTimerRef.current)
    }

    deliLeaveTimerRef.current = setTimeout(() => {
      setHoveredDeli(null)
      deliLeaveTimerRef.current = null
    }, 120)
  }

  const handleProductHoverEnter = (productKey: string) => {
    if (productLeaveTimerRef.current) {
      clearTimeout(productLeaveTimerRef.current)
      productLeaveTimerRef.current = null
    }

    if (productEnterTimerRef.current) {
      clearTimeout(productEnterTimerRef.current)
    }

    productEnterTimerRef.current = setTimeout(() => {
      setHoveredProduct(productKey)
      productEnterTimerRef.current = null
    }, 180)
  }

  const handleProductHoverLeave = () => {
    if (productEnterTimerRef.current) {
      clearTimeout(productEnterTimerRef.current)
      productEnterTimerRef.current = null
    }

    if (productLeaveTimerRef.current) {
      clearTimeout(productLeaveTimerRef.current)
    }

    productLeaveTimerRef.current = setTimeout(() => {
      setHoveredProduct(null)
      productLeaveTimerRef.current = null
    }, 120)
  }

  const handleLevel1HoverEnter = (level1Key: string) => {
    if (level1LeaveTimerRef.current) {
      clearTimeout(level1LeaveTimerRef.current)
      level1LeaveTimerRef.current = null
    }

    if (level1EnterTimerRef.current) {
      clearTimeout(level1EnterTimerRef.current)
    }

    level1EnterTimerRef.current = setTimeout(() => {
      setHoveredLevel1(level1Key)
      level1EnterTimerRef.current = null
    }, 180)
  }

  const handleLevel1HoverLeave = () => {
    if (level1EnterTimerRef.current) {
      clearTimeout(level1EnterTimerRef.current)
      level1EnterTimerRef.current = null
    }

    if (level1LeaveTimerRef.current) {
      clearTimeout(level1LeaveTimerRef.current)
    }

    level1LeaveTimerRef.current = setTimeout(() => {
      setHoveredLevel1(null)
      level1LeaveTimerRef.current = null
    }, 120)
  }

  useEffect(() => {
    return () => {
      if (categoryEnterTimerRef.current) clearTimeout(categoryEnterTimerRef.current)
      if (categoryLeaveTimerRef.current) clearTimeout(categoryLeaveTimerRef.current)
      if (deliEnterTimerRef.current) clearTimeout(deliEnterTimerRef.current)
      if (deliLeaveTimerRef.current) clearTimeout(deliLeaveTimerRef.current)
      if (productEnterTimerRef.current) clearTimeout(productEnterTimerRef.current)
      if (productLeaveTimerRef.current) clearTimeout(productLeaveTimerRef.current)
      if (level1EnterTimerRef.current) clearTimeout(level1EnterTimerRef.current)
      if (level1LeaveTimerRef.current) clearTimeout(level1LeaveTimerRef.current)
    }
  }, [])

  if (title === "Shop") {
    return (
      <div ref={megaMenuRef} className="bg-white border-t border-slate-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-6">
            {items.map((category) => (
              <div key={category.title} className="space-y-2">
                {category.items ? (
                  <>
                    <h3 className="font-heading font-semibold text-brand-primary text-sm uppercase tracking-wide border-b border-slate-200 pb-1">
                      {category.title}
                    </h3>
                    <Link
                      href={getViewAllUrl(category.title)}
                      className="block text-xs text-brand-primary hover:text-brand-red transition-colors font-medium pb-2 border-b border-slate-200 mb-2"
                      onClick={onClose}
                    >
                      View All {category.title} →
                    </Link>
                    <div className="space-y-1">
                      {category.items?.map((item) => (
                        <div key={item.title} className="relative">
                          {isCategory(item) ? (
                            <>
                              {item.href ? (
                                <Link
                                  href={item.href}
                                  data-node-type="category"
                                  data-trigger={
                                    category.title === "Deli & Biltong" ? undefined : `${category.title}-${item.title}`
                                  }
                                  data-deli-trigger={
                                    category.title === "Deli & Biltong" ? `${category.title}-${item.title}` : undefined
                                  }
                                  className="flex items-center justify-between font-medium text-slate-800 hover:text-brand-primary transition-colors text-sm py-1 group"
                                  onMouseEnter={() => {
                                    if (category.title === "Deli & Biltong") {
                                      handleDeliHoverEnter(`${category.title}-${item.title}`)
                                    } else {
                                      handleCategoryHoverEnter(`${category.title}-${item.title}`)
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    if (category.title === "Deli & Biltong") {
                                      handleDeliHoverLeave()
                                    } else {
                                      handleCategoryHoverLeave()
                                    }
                                  }}
                                  onClick={onClose}
                                >
                                  <span className="flex-1">{item.title}</span>
                                  <svg
                                    className="w-3 h-3 text-slate-400 group-hover:text-brand-primary transition-colors ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </Link>
                              ) : (
                                <div
                                  data-node-type="category"
                                  data-trigger={
                                    category.title === "Deli & Biltong" ? undefined : `${category.title}-${item.title}`
                                  }
                                  data-deli-trigger={
                                    category.title === "Deli & Biltong" ? `${category.title}-${item.title}` : undefined
                                  }
                                  className="flex items-center justify-between font-medium text-slate-800 hover:text-brand-primary transition-colors text-sm cursor-pointer py-1 group"
                                  onMouseEnter={() => {
                                    if (category.title === "Deli & Biltong") {
                                      handleDeliHoverEnter(`${category.title}-${item.title}`)
                                    } else {
                                      handleCategoryHoverEnter(`${category.title}-${item.title}`)
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    if (category.title === "Deli & Biltong") {
                                      handleDeliHoverLeave()
                                    } else {
                                      handleCategoryHoverLeave()
                                    }
                                  }}
                                >
                                  <span className="flex-1">{item.title}</span>
                                  <svg
                                    className="w-3 h-3 text-slate-400 group-hover:text-brand-primary transition-colors ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </div>
                              )}

                              {(hoveredCategory === `${category.title}-${item.title}` ||
                                hoveredDeli === `${category.title}-${item.title}`) && (
                                <div
                                  ref={(el) => {
                                    dropdownRefs.current[`${category.title}-${item.title}`] = el
                                  }}
                                  className="absolute left-full -ml-1 w-80 bg-white border border-slate-300 rounded-lg shadow-lg py-2 z-60"
                                  style={{
                                    top: dropdownPosition[`${category.title}-${item.title}`]?.top,
                                    bottom: dropdownPosition[`${category.title}-${item.title}`]?.bottom,
                                  }}
                                  onMouseEnter={() => {
                                    if (category.title === "Deli & Biltong") {
                                      if (deliLeaveTimerRef.current) {
                                        clearTimeout(deliLeaveTimerRef.current)
                                        deliLeaveTimerRef.current = null
                                      }
                                    } else {
                                      if (categoryLeaveTimerRef.current) {
                                        clearTimeout(categoryLeaveTimerRef.current)
                                        categoryLeaveTimerRef.current = null
                                      }
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    if (category.title === "Deli & Biltong") {
                                      handleDeliHoverLeave()
                                    } else {
                                      handleCategoryHoverLeave()
                                    }
                                  }}
                                >
                                  {category.title === "Deli & Biltong" ? (
                                    <>
                                      <div className="px-4 py-2 border-b border-slate-200 mb-2">
                                        <h4 className="font-heading font-medium text-brand-primary text-xs uppercase tracking-wide">
                                          {item.title}
                                        </h4>
                                      </div>
                                      <Link
                                        href={getViewAllUrl(category.title, undefined, item.title)}
                                        className="block px-4 py-2 text-xs text-brand-primary hover:text-brand-red transition-colors font-medium border-b border-slate-200 mb-2"
                                        onClick={onClose}
                                      >
                                        View All {item.title} →
                                      </Link>
                                      <div className={`grid gap-1 px-3 w-80 ${"grid-cols-2"}`}>
                                        {(() => {
                                          const staticProducts = getProductsForMenu(
                                            category.title,
                                            category.title, // This might be incorrect for 'Deli & Biltong' category title. meatType should be 'Deli'
                                            item.title,
                                          )
                                          return (staticProducts || []).map((product) => {
                                            const imageUrl = MEGAMENU_IMAGE_MAP[product.handle]

                                            return (
                                              <Link
                                                key={product.handle}
                                                href={`/products/${product.handle}`}
                                                data-node-type="product"
                                                data-handle={product.handle}
                                                className="flex flex-row items-center justify-between space-x-2 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                                                onClick={onClose}
                                              >
                                                <div className="flex-1 text-left">
                                                  <p className="text-xs font-medium text-slate-800 group-hover:text-brand-primary transition-colors leading-tight">
                                                    {product.title}
                                                  </p>
                                                </div>
                                                {imageUrl && (
                                                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                    <img
                                                      src={`${imageUrl}?width=64`}
                                                      alt={`${product.title} — Primary image`}
                                                      className="w-full h-full object-cover"
                                                      loading="lazy"
                                                      decoding="async"
                                                      width={48}
                                                      height={48}
                                                    />
                                                  </div>
                                                )}
                                              </Link>
                                            )
                                          })
                                        })()}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <Link
                                        href={getViewAllUrl(category.title, item.title)}
                                        className="block px-3 py-1.5 text-xs text-brand-primary hover:text-brand-red transition-colors font-medium border-b border-slate-200 mb-1 pb-2"
                                        onClick={onClose}
                                      >
                                        View All {item.title} →
                                      </Link>
                                      {item.items?.map((subItem) => (
                                        <div key={subItem.title} className="relative">
                                          {isCategory(subItem) ? (
                                            <>
                                              <div
                                                data-node-type="category"
                                                data-filters={JSON.stringify(
                                                  getCategoryFilters(category.title, subItem.title),
                                                )}
                                                data-product-trigger={`${category.title}-${item.title}-${subItem.title}`}
                                                className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-600 hover:text-brand-primary hover:bg-slate-50 transition-colors cursor-pointer group"
                                                onMouseEnter={() =>
                                                  handleProductHoverEnter(
                                                    `${category.title}-${item.title}-${subItem.title}`,
                                                  )
                                                }
                                                onMouseLeave={() => handleProductHoverLeave()}
                                              >
                                                <span className="flex-1">{subItem.title}</span>
                                                <svg
                                                  className="w-3 h-3 text-slate-400 group-hover:text-brand-primary transition-colors ml-1"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                  />
                                                </svg>
                                              </div>

                                              {hoveredProduct ===
                                                `${category.title}-${item.title}-${subItem.title}` && (
                                                <div
                                                  ref={(el) => {
                                                    dropdownRefs.current[
                                                      `${category.title}-${item.title}-${subItem.title}`
                                                    ] = el
                                                  }}
                                                  className="absolute left-full -ml-1 w-80 bg-white border border-slate-300 rounded-lg shadow-xl py-3 z-70"
                                                  style={{
                                                    top: dropdownPosition[
                                                      `${category.title}-${item.title}-${subItem.title}`
                                                    ]?.top,
                                                    bottom:
                                                      dropdownPosition[
                                                        `${category.title}-${item.title}-${subItem.title}`
                                                      ]?.bottom,
                                                  }}
                                                  onMouseEnter={() => {
                                                    if (productLeaveTimerRef.current) {
                                                      clearTimeout(productLeaveTimerRef.current)
                                                      productLeaveTimerRef.current = null
                                                    }
                                                  }}
                                                  onMouseLeave={() => handleProductHoverLeave()}
                                                >
                                                  <div className="px-4 py-2 border-b border-slate-200 mb-2">
                                                    <h4 className="font-heading font-medium text-brand-primary text-xs uppercase tracking-wide">
                                                      {subItem.title}
                                                    </h4>
                                                  </div>
                                                  <Link
                                                    href={getViewAllUrl(category.title, item.title, subItem.title)}
                                                    className="block px-4 py-2 text-xs text-brand-primary hover:text-brand-red transition-colors font-medium border-b border-slate-200 mb-2"
                                                    onClick={onClose}
                                                  >
                                                    {item.title === "Chicken" && subItem.title === "Whole"
                                                      ? "View All Whole Chicken →"
                                                      : `View All ${subItem.title} →`}
                                                  </Link>
                                                  <div className={`grid gap-1 px-3 ${"grid-cols-2"}`}>
                                                    {(() => {
                                                      const staticProducts = getProductsForMenu(
                                                        category.title,
                                                        item.title,
                                                        subItem.title,
                                                      )
                                                      return (staticProducts || []).map((product) => {
                                                        const imageUrl = MEGAMENU_IMAGE_MAP[product.handle]

                                                        return (
                                                          <Link
                                                            key={product.handle}
                                                            href={`/products/${product.handle}`}
                                                            data-node-type="product"
                                                            data-handle={product.handle}
                                                            className="flex flex-row items-center justify-between space-x-2 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                                                            onClick={onClose}
                                                          >
                                                            <div className="flex-1 text-left">
                                                              <p className="text-xs font-medium text-slate-800 group-hover:text-brand-primary transition-colors leading-tight">
                                                                {product.title}
                                                              </p>
                                                            </div>
                                                            {imageUrl && (
                                                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                                <img
                                                                  src={`${imageUrl}?width=64`}
                                                                  alt={`${product.title} — Primary image`}
                                                                  className="w-full h-full object-cover"
                                                                  loading="lazy"
                                                                  decoding="async"
                                                                  width={48}
                                                                  height={48}
                                                                />
                                                              </div>
                                                            )}
                                                          </Link>
                                                        )
                                                      })
                                                    })()}
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          ) : (
                                            <Link
                                              href={getProductUrl(subItem)}
                                              data-node-type="product"
                                              data-handle={subItem.href?.split("/").pop()}
                                              className="block px-3 py-1.5 text-xs text-slate-600 hover:text-brand-primary hover:bg-slate-50 transition-colors"
                                              onClick={onClose}
                                            >
                                              {subItem.title}
                                            </Link>
                                          )}
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              )}
                            </>
                          ) : shouldUseViewAllUrl(item, category.title) ? (
                            <Link
                              href={getViewAllUrl(category.title, undefined, item.title)}
                              data-node-type="filter-link"
                              className="block font-medium text-slate-800 hover:text-brand-primary transition-colors text-sm py-1"
                              onClick={onClose}
                            >
                              {item.title}
                            </Link>
                          ) : (
                            <Link
                              href={getProductUrl(item)}
                              data-node-type="product"
                              data-handle={item.href?.split("/").pop()}
                              className="block font-medium text-slate-800 hover:text-brand-primary transition-colors text-sm py-1"
                              onClick={onClose}
                            >
                              {item.title}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={category.href || "/collections/all"}
                    className="font-heading font-semibold text-brand-primary hover:text-brand-red transition-colors block text-sm uppercase tracking-wide"
                    onClick={onClose}
                  >
                    {category.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleShopAllClick}
              aria-label="Shop all products"
              className="bg-brand-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
            >
              Shop All
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (title === "Shop by Occasion") {
    return (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-80 bg-white border border-slate-400 rounded-xl shadow-lg py-4 z-50 mt-2">
        <Link
          href={buildMultiOccasionUrl(["braai", "ready-to-braai", "stew", "roast", "quick", "bulk", "snack"])}
          className="block px-6 py-2 text-sm text-brand-primary hover:text-brand-red transition-colors font-medium border-b border-slate-200 mb-2"
          onClick={onClose}
        >
          View All by Occasion →
        </Link>
        {items.map((item) => (
          <div key={item.title} className="relative">
            {isCategory(item) ? (
              <>
                {item.href ? (
                  <Link
                    href={item.href}
                    data-node-type="category"
                    className="px-6 py-2 text-slate-700 hover:text-brand-primary hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    onMouseEnter={() => handleLevel1HoverEnter(item.title)}
                    onMouseLeave={() => handleLevel1HoverLeave()}
                    onClick={onClose}
                  >
                    <span className="flex-1">{item.title}</span>
                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:text-brand-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <div
                    data-node-type="category"
                    className="px-6 py-2 text-slate-700 hover:text-brand-primary hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                    onMouseEnter={() => handleLevel1HoverEnter(item.title)}
                    onMouseLeave={() => handleLevel1HoverLeave()}
                  >
                    <span className="flex-1">{item.title}</span>
                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:text-brand-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                {hoveredLevel1 === item.title && (
                  <div
                    className={`absolute left-full -ml-1 w-72 bg-white border border-slate-300 rounded-xl shadow-lg py-3 z-60 ${
                      item.title === "Ready to Braai (Marinated & Flavoured)" || item.title === "Bulk & Hampers"
                        ? "-bottom-32" // Move dropdown up by positioning it above the trigger element
                        : "top-0"
                    }`}
                    onMouseEnter={() => {
                      if (level1LeaveTimerRef.current) {
                        clearTimeout(level1LeaveTimerRef.current)
                        level1LeaveTimerRef.current = null
                      }
                    }}
                    onMouseLeave={() => handleLevel1HoverLeave()}
                  >
                    <div className="px-4 py-2 border-b border-slate-200 mb-2">
                      <h4 className="font-heading font-medium text-brand-primary text-xs uppercase tracking-wide">
                        {item.title}
                      </h4>
                    </div>
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={getOccasionItemUrl(item.title, subItem.title)}
                        data-node-type="occasion-item"
                        className={`block px-4 py-2 text-sm transition-colors ${
                          subItem.title === "View All"
                            ? "text-brand-primary hover:text-brand-red font-medium border-b border-slate-200 mb-2"
                            : "text-slate-700 hover:text-brand-primary hover:bg-slate-50"
                        }`}
                        onClick={onClose}
                      >
                        {subItem.title === "View All" ? `View All ${item.title} →` : subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href || "#"}
                data-node-type="product"
                className="block px-6 py-2 text-slate-700 hover:text-brand-primary hover:bg-slate-50 transition-colors"
                onClick={onClose}
              >
                {item.title}
              </Link>
            )}
          </div>
        ))}
        <div className="mt-2 px-6">
          <button
            onClick={handleShopAllClick}
            aria-label="Shop all products"
            className="block w-full bg-brand-red text-white text-center px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
          >
            Shop All
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-64 bg-white border border-slate-400 rounded-xl shadow-lg py-4 z-50 mt-2">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href || "#"}
          className="block px-6 py-2 text-slate-700 hover:text-brand-primary hover:bg-slate-50 transition-colors"
          onClick={onClose}
        >
          {item.title}
        </Link>
      ))}
      <Link
        href="/collections/all"
        className="block px-6 py-2 text-sm text-brand-primary hover:text-brand-red transition-colors font-medium border-t border-slate-200 mt-2"
        onClick={onClose}
      >
        View All →
      </Link>
      <div className="mt-2 px-6">
        <button
          onClick={handleShopAllClick}
          aria-label="Shop all products"
          className="block w-full bg-brand-red text-white text-center px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
        >
          Shop All
        </button>
      </div>
    </div>
  )
}
