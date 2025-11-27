import type { Product, Review, NavItem, OccasionTag } from "./types"

function applyViewAllHrefs(items: NavItem[]): NavItem[] {
  return items.map((item) => {
    if (!item.items || item.items.length === 0) {
      return item
    }

    // Recursively process children first
    const processedItems = applyViewAllHrefs(item.items)

    // Look for a "View All" child (case-insensitive)
    const viewAllChild = processedItems.find((child) => child.title.toLowerCase() === "view all")

    if (viewAllChild?.href) {
      return {
        ...item,
        href: viewAllChild.href,
        items: processedItems,
      }
    }

    // Otherwise, return with processed children (keeping parent's existing href)
    return {
      ...item,
      items: processedItems,
    }
  })
}

// Raw navigation data structure
const rawNavigationItems: NavItem[] = [
  { title: "Home", href: "/" },
  {
    title: "Shop",
    items: [
      {
        title: "Butchery",
        items: [
          {
            title: "Beef",
            href: "/collections/butchery?department=butchery&meat_type=beef",
            items: [
              {
                title: "Steaks",
                href: "/collections/butchery?department=butchery&meat_type=beef&cut_family=steaks",
                items: [
                  { title: "Beef Fillet Portion", href: "/products/beef-fillet-portion" },
                  { title: "Beef Picanha (Rump Cap)", href: "/products/beef-picanha" },
                  { title: "Beef Ribeye Steak", href: "/products/beef-ribeye-steak" },
                  { title: "Beef Rump Steak", href: "/products/beef-rump-steak" },
                  { title: "Beef Sirloin", href: "/products/beef-sirloin" },
                  { title: "Club Steak", href: "/products/club-steak" },
                  { title: "Minute Steaks", href: "/products/minute-steaks" },
                  { title: "Prego", href: "/products/prego" },
                  { title: "T-Bone Steak", href: "/products/t-bone-steak" },
                  { title: "Tenderised Steak", href: "/products/tenderised-steak" },
                ],
              },
              {
                title: "Ribs & Rashers & Brisket & CHUCK",
                href: "/collections/butchery?department=butchery&meat_type=beef",
                items: [
                  { title: "Beef Brisket Sliced", href: "/products/beef-brisket-sliced" },
                  { title: "Deboned Beef Brisket", href: "/products/deboned-brisket" },
                  { title: "Whole Beef Brisket", href: "/products/whole-brisket" },
                  { title: "Beef Ribeye on the Bone", href: "/products/beef-ribeye-on-the-bone" },
                  { title: "Beef Short Rib", href: "/products/beef-short-rib" },
                  { title: "Whole Chuck", href: "/products/whole-chuck" },
                  { title: "Beef Rashers", href: "/products/beef-rashers" },
                ],
              },
              {
                title: "Roasts & Large Cuts",
                href: "/collections/butchery?department=butchery&meat_type=beef&cut_family=roasts",
                items: [
                  { title: "Silverside Roast", href: "/products/silverside-roast" },
                  { title: "Topside Roast", href: "/products/topside-roast" },
                  { title: "Beef Whole Fillet", href: "/products/beef-whole-fillet" },
                ],
              },
              {
                title: "Mince & Burgers",
                href: "/collections/butchery?department=butchery&meat_type=beef&cut_family=mince-burgers",
                items: [
                  { title: "Lean Beef Mince", href: "/products/lean-beef-mince" },
                  { title: "Topside Beef Mince", href: "/products/topside-beef-mince" },
                  { title: "Beef Patties STANDARD (4×100g)", href: "/products/beef-patties-standard-4x100g" },
                  { title: "Beef Patties LARGE (4×120g)", href: "/products/beef-patties-large-4x120g" },
                  { title: "Beef Patties X-LARGE (4×150g)", href: "/products/beef-patties-x-large-4x150g" },
                  { title: "Beef Patties XX-LARGE (2×250g)", href: "/products/beef-patties-xx-large-2x250g" },
                ],
              },
              {
                title: "Stew & Stirfry & Other",
                href: "/collections/butchery?department=butchery&meat_type=beef&cut_family=stew-stirfry",
                items: [
                  { title: "Beef Chuck Sliced", href: "/products/beef-chuck-sliced" },
                  { title: "Beef Goulash", href: "/products/beef-goulash" },
                  { title: "Beef Shin", href: "/products/beef-shin" },
                  { title: "Beef Stew (Bone-in)", href: "/products/beef-stew-bone-in" },
                  { title: "Beef Stew (Boneless)", href: "/products/beef-stew-boneless" },
                  { title: "Beef Stirfry", href: "/products/beef-stirfry" },
                ],
              },
              {
                title: "OXTAIL & Speciality",
                href: "/collections/butchery?department=butchery&meat_type=beef&cut_family=oxtail",
                items: [
                  { title: "Oxtail", href: "/products/oxtail" },
                  { title: "Ox Tongue", href: "/products/ox-tongue" },
                ],
              },
              {
                title: "Sosaties",
                href: "/collections/butchery?department=butchery&meat_type=beef&cut_family=sosaties",
                items: [
                  { title: "Beef Sosaties – BBQ", href: "/products/beef-sosaties-bbq" },
                  { title: "Beef Sosaties – Red Wine & Garlic", href: "/products/beef-sosaties-red-wine-garlic" },
                  { title: "Beef Sosaties – Sweet Curry", href: "/products/beef-sosaties-sweet-curry" },
                  {
                    title: "Beef Sosaties – Rump & Bacon (Sweet & Sour)",
                    href: "/products/beef-sosaties-rump-bacon-sweet-sour",
                  },
                  {
                    title: "Beef Sosaties – Smoked Brisket (Steakhouse)",
                    href: "/products/beef-sosaties-smoked-brisket-steakhouse",
                  },
                ],
              },
            ],
          },
          {
            title: "Lamb",
            href: "/collections/butchery?department=butchery&meat_type=lamb",
            items: [
              {
                title: "Chops & Steaks",
                href: "/collections/butchery?department=butchery&meat_type=lamb&cut_family=chops",
                items: [
                  { title: "Lamb Leg Chops", href: "/products/lamb-leg-chops" },
                  { title: "Lamb Loin Chops", href: "/products/lamb-loin-chops" },
                  { title: "Lamb Rib Chops", href: "/products/lamb-rib-chops" },
                  { title: "Lamb Shoulder Chops", href: "/products/lamb-shoulder-chops" },
                ],
              },
              {
                title: "Ribs",
                href: "/collections/butchery?department=butchery&meat_type=lamb",
                items: [
                  { title: "Deboned Lamb Rib", href: "/products/deboned-lamb-rib" },
                  { title: "Whole Lamb Rib", href: "/products/whole-lamb-rib" },
                  { title: "Wind Dry Lamb Rib", href: "/products/wind-dry-lamb-rib" },
                ],
              },
              {
                title: "Roasts & Large Cuts",
                href: "/collections/butchery?department=butchery&meat_type=lamb&cut_family=roasts",
                items: [
                  { title: "Deboned Leg of Lamb", href: "/products/deboned-leg-of-lamb" },
                  { title: "Whole Leg of Lamb", href: "/products/whole-leg-of-lamb" },
                ],
              },
              {
                title: "Stew & Pot Cuts",
                href: "/collections/butchery?department=butchery&meat_type=lamb",
                items: [
                  { title: "Lamb Neck", href: "/products/lamb-neck" },
                  { title: "Lamb Potjiekos", href: "/products/lamb-potjiekos" },
                  { title: "Lamb Shanks (350g)", href: "/products/lamb-shanks-350g" },
                ],
              },
              {
                title: "Sosaties",
                href: "/collections/butchery?department=butchery&meat_type=lamb&cut_family=sosaties",
                items: [
                  {
                    title: "Lamb & Peach Sosaties (Sweet Curry)",
                    href: "/products/lamb-and-peach-sosaties-sweet-curry",
                  },
                  { title: "Lamb Rib Sosaties – Sweet Curry", href: "/products/lamb-rib-sosaties-sweet-curry" },
                ],
              },
              {
                title: "Bulk/Whole",
                href: "/collections/butchery?department=butchery&meat_type=lamb",
                items: [
                  { title: "Whole Lamb", href: "/products/whole-lamb" },
                  { title: "Half Lamb", href: "/products/half-lamb" },
                  { title: "Quarter Lamb Pack 6kg", href: "/products/quarter-lamb-pack-6kg" },
                ],
              },
            ],
          },
          {
            title: "Pork",
            href: "/collections/butchery?department=butchery&meat_type=pork",
            items: [
              {
                title: "Chops & Steaks",
                href: "/collections/butchery?department=butchery&meat_type=pork&cut_family=chops",
                items: [
                  { title: "Pork Neck Steak", href: "/products/pork-neck-steak" },
                  { title: "Pork Loin Chops", href: "/products/pork-loin-chops" },
                  { title: "Pork Shoulder Chops", href: "/products/pork-shoulder-chops" },
                  { title: "Pork Leg Chops", href: "/products/pork-leg-chops" },
                  { title: "Crumbed Pork Chops", href: "/products/crumbed-pork-chops" },
                ],
              },
              {
                title: "Belly, Ribs & Rashers",
                href: "/collections/butchery?department=butchery&meat_type=pork",
                items: [
                  { title: "Pork Belly Deboned", href: "/products/pork-belly-deboned" },
                  { title: "Pork Rashers", href: "/products/pork-rashers" },
                  { title: "Pork Spare Ribs", href: "/products/pork-spare-ribs" },
                  { title: "Deboned Pork Spare Ribs", href: "/products/deboned-pork-spare-ribs" },
                ],
              },
              {
                title: "Roasts & Large Cuts",
                href: "/collections/butchery?department=butchery&meat_type=pork&cut_family=roasts",
                items: [
                  { title: "Deboned Pork Leg", href: "/products/deboned-pork-leg" },
                  { title: "Pork Leg (Whole)", href: "/products/pork-leg-whole" },
                  { title: "Pork Loin (Whole)", href: "/products/pork-loin-whole" },
                  { title: "Pork Neck (Whole)", href: "/products/pork-neck-whole" },
                  { title: "Pork Shoulder (Whole)", href: "/products/pork-shoulder-whole" },
                ],
              },
              {
                title: "Stew & Stirfry",
                href: "/collections/butchery?department=butchery&meat_type=pork&cut_family=stew-stirfry",
                items: [
                  { title: "Pork Goulash", href: "/products/pork-goulash" },
                  { title: "Pork Stirfry", href: "/products/pork-stirfry" },
                ],
              },
              {
                title: "Gammon",
                href: "/collections/butchery?department=butchery&meat_type=pork&cut_family=gammon",
                items: [{ title: "Deboned Gammon", href: "/products/deboned-gammon" }],
              },
              {
                title: "Sosaties",
                href: "/collections/butchery?department=butchery&meat_type=pork&cut_family=sosaties",
                items: [
                  { title: "Pork Neck Sosaties (Sweet & Sour)", href: "/products/pork-neck-sosaties-sweet-sour" },
                ],
              },
            ],
          },
          {
            title: "Chicken",
            href: "/collections/butchery?department=butchery&meat_type=chicken",
            items: [
              {
                title: "Whole",
                href: "/collections/butchery?department=butchery&meat_type=chicken&cut_family=whole-bird",
                items: [{ title: "Whole Chicken (±2.3 kg)", href: "/products/whole-chicken-1-2kg" }],
              },
              {
                title: "Cuts",
                href: "/collections/butchery?department=butchery&meat_type=chicken",
                items: [
                  { title: "Chicken Drumsticks", href: "/products/chicken-drumsticks" },
                  { title: "Chicken Drummets", href: "/products/chicken-drummets" },
                  { title: "Chicken Thighs", href: "/products/chicken-thighs" },
                  { title: "Chicken Wings", href: "/products/chicken-wings" },
                  { title: "Chicken Fillets", href: "/products/chicken-fillets" },
                  { title: "Chicken Star Pack", href: "/products/chicken-star-pack" },
                ],
              },
              {
                title: "Sosaties",
                href: "/collections/butchery?department=butchery&meat_type=chicken&cut_family=sosaties",
                items: [
                  { title: "Chicken Sosaties – BBQ", href: "/products/chicken-sosaties-bbq" },
                  { title: "Chicken Sosaties – Honey & Mustard", href: "/products/chicken-sosaties-honey-mustard" },
                  { title: "Chicken Sosaties – Lemon & Herb", href: "/products/chicken-sosaties-lemon-herb" },
                  {
                    title: "Chicken Sosaties – Chicken & Bacon (Sweet & Sour)",
                    href: "/products/chicken-sosaties-chicken-bacon-sweet-sour",
                  },
                  { title: "Chicken Sosaties – Mango & Chutney", href: "/products/chicken-sosaties-mango-chutney" },
                ],
              },
            ],
          },
          {
            title: "Wors & Sausages",
            href: "/collections/butchery?department=butchery&meat_type=wors-sausages",
            items: [
              { title: "Thin Chilli Boerewors", href: "/products/thin-chilli-boerewors" },
              { title: "Chutney Boerewors", href: "/products/chutney-boerewors" },
              { title: "Double Tangy Cheesegriller", href: "/products/double-tangy-cheesegriller" },
              { title: "Thin Double Tangy Cheesegriller", href: "/products/thin-double-tangy-cheesegriller" },
              { title: "Thick Cheese Wors", href: "/products/thick-cheese-wors" },
              { title: "Thin Cheese Wors", href: "/products/thin-cheese-wors" },
              { title: "Just Beef Boerewors", href: "/products/just-beef-boerewors" },
              { title: "Thin Just Beef Boerewors", href: "/products/thin-just-beef-boerewors" },
              { title: "Thin Sheep Boerewors", href: "/products/thin-sheep-boerewors" },
              { title: "Thin Watertand Boerewors", href: "/products/thin-watertand-boerewors" },
              { title: "Watertand Boerewors", href: "/products/watertand-boerewors" },
              { title: "Watertand Boerewors Bulk", href: "/products/watertand-boerewors-bulk" },
              { title: "Ouma Boerewors", href: "/products/ouma-boerewors" },
              { title: "Sosatie Wors", href: "/products/sosatie-wors" },
              { title: "Spekwors Boerewors", href: "/products/spekwors-boerewors" },
            ],
          },
          {
            title: "Sosaties",
            href: "/collections/butchery?department=butchery&cut_family=sosaties",
            items: [
              {
                title: "Beef",
                href: "/collections/butchery?department=butchery&meat_type=beef&cut_family=sosaties",
                items: [
                  { title: "Beef Sosaties – BBQ", href: "/products/beef-sosaties-bbq" },
                  { title: "Beef Sosaties – Red Wine & Garlic", href: "/products/beef-sosaties-red-wine-garlic" },
                  { title: "Beef Sosaties – Sweet Curry", href: "/products/beef-sosaties-sweet-curry" },
                  {
                    title: "Beef Sosaties – Rump & Bacon (Sweet & Sour)",
                    href: "/products/beef-sosaties-rump-bacon-sweet-sour",
                  },
                  {
                    title: "Beef Sosaties – Smoked Brisket (Steakhouse)",
                    href: "/products/beef-sosaties-smoked-brisket-steakhouse",
                  },
                ],
              },
              {
                title: "Lamb",
                href: "/collections/butchery?department=butchery&meat_type=lamb&cut_family=sosaties",
                items: [
                  {
                    title: "Lamb & Peach Sosaties (Sweet Curry)",
                    href: "/products/lamb-and-peach-sosaties-sweet-curry",
                  },
                  { title: "Lamb Rib Sosaties – Sweet Curry", href: "/products/lamb-rib-sosaties-sweet-curry" },
                ],
              },
              {
                title: "Pork",
                href: "/collections/butchery?department=butchery&meat_type=pork&cut_family=sosaties",
                items: [
                  { title: "Pork Neck Sosaties (Sweet & Sour)", href: "/products/pork-neck-sosaties-sweet-sour" },
                ],
              },
              {
                title: "Chicken",
                href: "/collections/butchery?department=butchery&meat_type=chicken&cut_family=sosaties",
                items: [
                  { title: "Chicken Sosaties – BBQ", href: "/products/chicken-sosaties-bbq" },
                  { title: "Chicken Sosaties – Honey & Mustard", href: "/products/chicken-sosaties-honey-mustard" },
                  { title: "Chicken Sosaties – Lemon & Herb", href: "/products/chicken-sosaties-lemon-herb" },
                  {
                    title: "Chicken Sosaties – Chicken & Bacon (Sweet & Sour)",
                    href: "/products/chicken-sosaties-chicken-bacon-sweet-sour",
                  },
                  { title: "Chicken Sosaties – Mango & Chutney", href: "/products/chicken-sosaties-mango-chutney" },
                ],
              },
            ],
          },
          {
            title: "Bacon Rashers & Ham",
            href: "/collections/butchery?department=butchery",
            items: [
              { title: "Streaky Bacon", href: "/products/streaky-bacon" },
              { title: "Beef Rashers", href: "/products/beef-rashers" },
              { title: "Deboned Gammon", href: "/products/deboned-gammon" },
            ],
          },
          {
            title: "Hampers & Value Packs",
            href: "/collections/hampers",
            items: [
              { title: "Cyber Hamper", href: "/products/cyber-hamper" },
              { title: "Meat Hamper – Braai Pack", href: "/products/meat-hamper-braai-pack" },
              { title: "Meat Hamper – Economical Pack", href: "/products/meat-hamper-economical-pack" },
              { title: "Meat Hamper – Jukskei", href: "/products/meat-hamper-jukskei" },
              { title: "Meat Hamper – Ossewa", href: "/products/meat-hamper-ossewa" },
              { title: "Meat Hamper – Randsaver Pack", href: "/products/meat-hamper-randsaver-pack-2" },
              { title: "Meat Hamper – Saver Pack", href: "/products/meat-hamper-saver-pack" },
              { title: "Meat Hamper – Super Pack", href: "/products/meat-hamper-super-pack" },
              { title: "Meat Hamper – Sweep", href: "/products/meat-hamper-sweep" },
              { title: "Meat Hamper – Voortrekker", href: "/products/meat-hamper-voortrekker" },
            ],
          },
        ],
      },
      {
        title: "Deli & Biltong",
        href: "/collections/deli-biltong?department=deli-biltong",
        items: [
          {
            title: "Biltong",
            href: "/collections/deli-biltong?department=deli-biltong&deli_type=biltong",
            items: [
              { title: "Biltong", href: "/products/biltong" },
              { title: "Chilli Biltong", href: "/products/chilli-biltong" },
              { title: "Chutney Biltong", href: "/products/chutney-biltong" },
              { title: "Lemon Pepper Biltong", href: "/products/lemon-pepper-biltong" },
              { title: "Babalas Biltong", href: "/products/babalas-biltong" },
            ],
          },
          {
            title: "Droëwors",
            href: "/collections/deli-biltong?department=deli-biltong&deli_type=droewors",
            items: [
              { title: "Original Droëwors", href: "/products/original-droewors" },
              { title: "Chilli Droëwors", href: "/products/chilli-droewors" },
              { title: "Fat Free Droëwors", href: "/products/fat-free-droewors" },
              { title: "Flat Droëwors", href: "/products/flat-droewors" },
              { title: "Banting Friendly Droëwors", href: "/products/banting-friendly-droewors" },
              { title: "Wagyu Droëwors", href: "/products/wagyu-droewors" },
            ],
          },
          {
            title: "Sticks",
            href: "/collections/deli-biltong?department=deli-biltong&deli_type=sticks",
            items: [
              { title: "BBQ Sticks", href: "/products/bbq-sticks" },
              { title: "Chilli Sticks", href: "/products/chilli-sticks" },
              { title: "Thai Sweet Chilli Sticks", href: "/products/thai-sweet-chilli-sticks" },
            ],
          },
          {
            title: "Thin Sticks",
            href: "/collections/deli-biltong?department=deli-biltong&deli_type=thin-sticks",
            items: [
              { title: "Droëwors Thin Sticks", href: "/products/drywors-thin-sticks" },
              { title: "Chilli Droëwors Thin Sticks", href: "/products/chilli-drywors-thin-sticks" },
              { title: "Salami Thin Sticks", href: "/products/salami-thin-sticks" },
              { title: "Venison Thin Sticks", href: "/products/venison-thin-sticks" },
            ],
          },
          {
            title: "Bacon Biltong",
            href: "/collections/deli-biltong?department=deli-biltong&deli_type=bacon-biltong",
            items: [
              { title: "Honey Bacon Biltong", href: "/products/honey-bacon-biltong" },
              { title: "Chilli Bacon Biltong", href: "/products/chilli-bacon-biltong" },
              { title: "Lemon Pepper Bacon Biltong", href: "/products/lemon-pepper-bacon-biltong" },
            ],
          },
          {
            title: "Other",
            href: "/collections/deli-biltong?department=deli-biltong&deli_type=other",
            items: [
              { title: "Biltong Skille (Crumbs)", href: "/products/biltong-skille-crumbs" },
              { title: "Biltong Wagon Wheels", href: "/products/biltong-wagon-wheels" },
              { title: "Cabanossi", href: "/products/cabanossi" },
              { title: "Home-made Salami", href: "/products/salami" },
              { title: "Salami Sticks", href: "/products/salami-sticks" },
              { title: "Pork Crackling", href: "/products/pork-crackling" },
              { title: "Poeier Biltong (Powder)", href: "/products/poeier-biltong-powder" },
            ],
          },
        ],
      },
      {
        title: "Spices & Sauces",
        items: [{ title: "Spices & Rubs" }, { title: "Sauces & Marinades" }, { title: "Stocks & Gravies" }],
      },
      {
        title: "Braai Gear",
        items: [
          { title: "Grids & Tongs" },
          { title: "Pots & Potjie Care" },
          { title: "Tools & Thermometers" },
          { title: "Cleaners & Scoops" },
          { title: "Wood & Charcoal" },
        ],
      },
      {
        title: "Groceries",
        items: [{ title: "Cold Drinks" }],
      },
    ],
  },
  {
    title: "Shop by Occasion",
    items: [
      {
        title: "Great for Braai",
        href: "/occasions/braai",
        items: [
          { title: "View All", href: "/collections/butchery?occasion=braai&department=butchery" },
          { title: "Steaks", href: "/occasions/braai/steaks" },
          { title: "Boerewors & Cheese Wors", href: "/occasions/braai/boerewors" },
          { title: "Chicken Flatties", href: "/occasions/braai/chicken-flatties" },
          { title: "Sosaties", href: "/occasions/braai/sosaties" },
          { title: "Pork Chops & Ribs", href: "/occasions/braai/pork-chops-ribs" },
          {
            title: "Wood & Charcoal",
            href: "/collections/braai-gear?department=braai-gear&braai_gear_family=wood-charcoal",
          },
        ],
      },
      {
        title: "Bulk & Hampers",
        href: "/occasions/bulk",
        items: [
          { title: "View All", href: "/collections/butchery?occasion=bulk&department=butchery" },
          { title: "Quarter Lamb Pack", href: "/occasions/bulk/quarter-lamb" },
          { title: "Whole Lamb", href: "/occasions/bulk/whole-lamb" },
          { title: "All Meat Hampers", href: "/occasions/bulk/meat-hampers" },
          { title: "Biltong Hampers", href: "/occasions/bulk/biltong-hampers" },
        ],
      },
      {
        title: "Great for Roasts",
        href: "/occasions/roast",
        items: [
          { title: "View All", href: "/collections/butchery?occasion=roast&department=butchery" },
          { title: "Whole Leg of Lamb / Deboned Leg of Lamb", href: "/occasions/roast/leg-of-lamb" },
          { title: "Pork Leg / Deboned Pork Leg", href: "/occasions/roast/pork-leg" },
          { title: "Pork Neck Whole", href: "/occasions/roast/pork-neck" },
          { title: "Whole Chicken", href: "/occasions/roast/whole-chicken" },
          { title: "Beef Chuck", href: "/occasions/roast/beef-chuck" },
        ],
      },
      {
        title: "Weeknight Quick & Easy",
        href: "/occasions/quick",
        items: [
          { title: "View All", href: "/collections/butchery?occasion=quick&department=butchery" },
          { title: "Beef Stirfry", href: "/occasions/quick/beef-stirfry" },
          { title: "Pork Stirfry", href: "/occasions/quick/pork-stirfry" },
          { title: "Chicken Thighs, Drumsticks, Wings", href: "/occasions/quick/chicken-pieces" },
          { title: "Chicken Breast Fillets", href: "/occasions/quick/chicken-breast" },
          { title: "Mince & Patties", href: "/occasions/quick/mince-patties" },
        ],
      },
      {
        title: "Ready to Braai (Marinated & Flavoured)",
        href: "/occasions/ready-to-braai",
        items: [
          { title: "View All", href: "/collections/butchery?occasion=ready-to-braai&department=butchery" },
          { title: "Chicken Flatties (Marinated)", href: "/occasions/ready-to-braai/chicken-flatties" },
          {
            title: "Beef Sosaties (BBQ, Red Wine & Garlic, Sweet Curry)",
            href: "/occasions/ready-to-braai/beef-sosaties",
          },
          {
            title: "Chicken Sosaties (BBQ, Honey Mustard, Lemon & Herb, Mango & Chutney)",
            href: "/occasions/ready-to-braai/chicken-sosaties",
          },
          {
            title: "Lamb Sosaties (BBQ Rib, Red Wine & Garlic, Leg Sosaties)",
            href: "/occasions/ready-to-braai/lamb-sosaties",
          },
        ],
      },
      {
        title: "Great for Stew & Potjiekos",
        href: "/occasions/stew",
        items: [
          { title: "View All", href: "/collections/butchery?occasion=stew&department=butchery" },
          { title: "Beef Stew (Bone-in / Boneless)", href: "/occasions/stew/beef-stew" },
          { title: "Beef Shin", href: "/occasions/stew/beef-shin" },
          { title: "Oxtail", href: "/occasions/stew/oxtail" },
          { title: "Lamb Shanks", href: "/occasions/stew/lamb-shanks" },
          { title: "Lamb Potjiekos", href: "/occasions/stew/lamb-potjiekos" },
          { title: "Pork Stew", href: "/occasions/stew/pork-stew" },
        ],
      },
    ],
  },
  { title: "Game Processing", href: "/game-processing" },
  { title: "Spitbraai Hire", href: "/spitbraai-hire" },
  { title: "Recipes", href: "/recipes" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
]

export const navigationItems: NavItem[] = applyViewAllHrefs(rawNavigationItems)

export const occasionTags: OccasionTag[] = [
  {
    id: "1",
    title: "Great for Braai",
    handle: "braai",
    image: "/images/braai.jpg",
  },
  {
    id: "6",
    title: "Bulk & Hampers",
    handle: "bulk",
    image: "/images/bulk.jpg",
  },
  {
    id: "3",
    title: "Great for Roasts",
    handle: "roast",
    image: "/images/roasts.jpg",
  },
  {
    id: "4",
    title: "Weeknight Quick & Easy",
    handle: "quick",
    image: "/images/quick-20-26-20easy.jpg",
  },
  {
    id: "5",
    title: "Ready to Braai",
    handle: "ready-to-braai",
    image: "/images/ready-20to-20braai.jpg",
  },
  {
    id: "2",
    title: "Great for Stew & Potjiekos",
    handle: "stew",
    image: "/images/stew-20-26-20potjiekos.jpg",
  },
]

export const sampleProducts: Product[] = [
  {
    id: "1",
    title: "Premium Ribeye Steak",
    handle: "premium-ribeye-steak",
    image: "/ribeye-steak-premium-marbled.jpg",
    pricePerKg: 280,
    tags: ["beef", "braai", "premium", "steak"],
    description:
      "Premium aged ribeye steak with excellent marbling for the perfect braai experience. This cut delivers exceptional tenderness and rich, beefy flavor that's perfect for grilling.",
    inStock: true,
  },
  {
    id: "2",
    title: "Traditional Boerewors",
    handle: "traditional-boerewors",
    image: "/boerewors-traditional-sausage-coiled.jpg",
    pricePerKg: 120,
    tags: ["wors", "braai", "traditional", "quick"],
    description:
      "Authentic boerewors made with traditional spices and premium beef and pork. Hand-made using our family recipe passed down through generations.",
    inStock: true,
  },
  {
    id: "3",
    title: "Lamb Sosaties",
    handle: "lamb-sosaties",
    image: "/lamb-sosaties-skewers-marinated.jpg",
    pricePerKg: 180,
    tags: ["lamb", "sosaties", "braai", "marinated", "ready-to-braai"],
    description:
      "Tender lamb sosaties marinated in traditional Cape Malay spices. Ready to braai - just throw them on the grill for an authentic South African experience.",
    inStock: true,
  },
  {
    id: "4",
    title: "Beef Stew Meat",
    handle: "beef-stew-meat",
    image: "/beef-stew-meat-cubed-chunks.jpg",
    pricePerKg: 150,
    tags: ["beef", "stew", "potjiekos", "slow-cook"],
    description:
      "Perfect cuts for slow cooking, stews, and traditional potjiekos. These tender chunks become melt-in-your-mouth delicious when slow-cooked.",
    inStock: true,
  },
  {
    id: "5",
    title: "Leg of Lamb Roast",
    handle: "leg-of-lamb-roast",
    image: "/leg-of-lamb-roast-whole-bone-in.jpg",
    pricePerKg: 220,
    tags: ["lamb", "roast", "family", "special-occasion"],
    description:
      "Whole leg of lamb, perfect for Sunday roasts and special occasions. Feeds 6-8 people and creates a memorable centerpiece for any gathering.",
    inStock: true,
  },
  {
    id: "6",
    title: "Droëwors Sticks",
    handle: "droewors-sticks",
    image: "/droewors-biltong-dried-sausage.jpg",
    pricePerKg: 450,
    tags: ["biltong", "deli", "snack", "traditional"],
    description:
      "Traditional South African dried sausage, perfect for snacking. Made using traditional air-drying methods for authentic flavor and texture.",
    inStock: true,
  },
  {
    id: "7",
    title: "Beef T-Bone Steak",
    handle: "beef-t-bone-steak",
    image: "/placeholder.svg?key=tbone",
    pricePerKg: 260,
    tags: ["beef", "braai", "steak", "premium"],
    description:
      "Classic T-bone steak with tenderloin and strip steak. The best of both worlds in one cut - perfect for the serious braai master.",
    inStock: true,
  },
  {
    id: "8",
    title: "Lamb Chops",
    handle: "lamb-chops",
    image: "/placeholder.svg?key=lambchops",
    pricePerKg: 240,
    tags: ["lamb", "braai", "chops", "quick"],
    description:
      "Tender lamb chops, perfect for quick grilling. Season simply with salt and pepper for a delicious weeknight meal.",
    inStock: true,
  },
  {
    id: "9",
    title: "Pork Belly",
    handle: "pork-belly",
    image: "/placeholder.svg?key=porkbelly",
    pricePerKg: 140,
    tags: ["pork", "roast", "slow-cook"],
    description:
      "Succulent pork belly for roasting or slow cooking. The perfect balance of meat and fat creates incredibly flavorful and tender results.",
    inStock: true,
  },
  {
    id: "10",
    title: "Chicken Breasts",
    handle: "chicken-breasts",
    image: "/placeholder.svg?key=chickenbreast",
    pricePerKg: 90,
    tags: ["chicken", "quick", "healthy"],
    description:
      "Fresh chicken breasts for quick and healthy meals. Versatile and lean, perfect for grilling, pan-frying, or baking.",
    inStock: true,
  },
  {
    id: "11",
    title: "Biltong Slices",
    handle: "biltong-slices",
    image: "/biltong-deli-traditional-south-african.jpg",
    pricePerKg: 380,
    tags: ["biltong", "deli", "snack", "traditional"],
    description:
      "Premium biltong slices, air-dried to perfection. Made from the finest cuts of beef and seasoned with traditional spices.",
    inStock: true,
  },
  {
    id: "12",
    title: "Beef Mince",
    handle: "beef-mince",
    image: "/placeholder.svg?key=beefmince",
    pricePerKg: 110,
    tags: ["beef", "mince", "quick", "versatile"],
    description:
      "Fresh beef mince for burgers, meatballs, and more. Ground fresh daily from premium cuts for maximum flavor and quality.",
    inStock: true,
  },
  {
    id: "13",
    title: "Braai Spice Mix",
    handle: "braai-spice-mix",
    image: "/placeholder.svg?key=spicemix",
    pricePerKg: 180,
    tags: ["spices", "braai", "seasoning"],
    description: "Our signature braai spice blend. Perfect for seasoning any meat before grilling.",
    inStock: true,
  },
  {
    id: "14",
    title: "Boerewors Sauce",
    handle: "boerewors-sauce",
    image: "/placeholder.svg?key=sauce",
    pricePerKg: 85,
    tags: ["sauces", "condiment"],
    description: "Traditional tomato-based sauce perfect for boerewors and other grilled meats.",
    inStock: true,
  },
  {
    id: "15",
    title: "Braai Tongs",
    handle: "braai-tongs",
    image: "/placeholder.svg?key=tongs",
    pricePerKg: 120,
    tags: ["braai-gear", "equipment"],
    description: "Heavy-duty stainless steel braai tongs. Essential equipment for any serious braai master.",
    inStock: true,
  },
  {
    id: "16",
    title: "BBQ Sticks",
    handle: "bbq-sticks",
    image: "/bbq-meat-sticks-dried-snack.jpg",
    pricePerKg: 420,
    tags: ["biltong", "deli", "snack", "bbq"],
    description:
      "Savory BBQ flavored meat sticks, perfect for on-the-go snacking. Made with premium beef and our signature BBQ seasoning blend.",
    inStock: true,
  },
  {
    id: "17",
    title: "Chilli Biltong",
    handle: "chilli-biltong",
    image: "/spicy-chilli-biltong-dried-meat.jpg",
    pricePerKg: 390,
    tags: ["biltong", "deli", "snack", "spicy"],
    description:
      "Spicy chilli biltong for those who like it hot. Premium beef seasoned with traditional spices and a kick of chilli.",
    inStock: true,
  },
  {
    id: "18",
    title: "Original Biltong Chunks",
    handle: "original-biltong-chunks",
    image: "/traditional-biltong-chunks-dried-beef.jpg",
    pricePerKg: 400,
    tags: ["biltong", "deli", "snack", "traditional"],
    description:
      "Traditional biltong chunks, air-dried using time-honored methods. Perfect texture and authentic South African flavor.",
    inStock: true,
  },
  {
    id: "19",
    title: "Thin Drywors Sticks",
    handle: "thin-drywors-sticks",
    image: "/thin-dried-sausage-sticks-biltong.jpg",
    pricePerKg: 460,
    tags: ["biltong", "deli", "snack", "droewors"],
    description:
      "Thin drywors sticks for easy snacking. Made with premium beef and traditional spices, perfect for lunch boxes or road trips.",
    inStock: true,
  },
]

export const sampleReviews: Review[] = [
  {
    id: "1",
    name: "Johan van der Merwe",
    rating: 5,
    text: "Best quality meat in Pretoria! The ribeye steaks are always perfectly aged and the service is exceptional.",
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    rating: 5,
    text: "I've been a customer for years. Their boerewors is authentic and delicious, and the biltong is always fresh.",
    date: "2024-01-20",
  },
  {
    id: "3",
    name: "Pieter Steyn",
    rating: 5,
    text: "Great selection of cuts and very knowledgeable staff. They helped me choose the perfect roast for our family gathering.",
    date: "2024-01-25",
  },
  {
    id: "4",
    name: "Linda Naidoo",
    rating: 5,
    text: "The quality is consistently excellent and prices are very reasonable. Highly recommend their lamb chops!",
    date: "2024-02-01",
  },
  {
    id: "5",
    name: "Andries Botha",
    rating: 5,
    text: "Been buying my meat here for over 10 years. Never disappointed. The game processing service is also top-notch.",
    date: "2024-02-05",
  },
]
