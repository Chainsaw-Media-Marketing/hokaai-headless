const WHOLE_CARCASS = [
  {
    label: "Standard Processing",
    price: "R35.00 p/kg",
    note: "Biltong, droëwors, braaiwors, potjiekos, mince. (Price includes: casings, spices and spek)",
  },
  { label: "Warthog Processing", price: "R45.00 p/kg", note: "Non-smoked products" },
  {
    label: "Warthog Processing",
    price: "R55.00 p/kg",
    note: "Salami, cabanossi, cheesegrillers, and all smoked products.",
  },
  { label: "Butchering Without Processing", price: "R15.00 p/kg", note: "Potjiekos and Steaks" },
  {
    label: "Processing With Option On Additional Costs",
    price: "R25.00 p/kg",
    note: "All additional items calculated afterwards",
  },
  { label: "Extras", price: "R15.00 p/kg", note: "Sosaties, biltong sticks, patties etc." },
]

const PROCESSED_CARCASS = [
  { label: "Wors & Droëwors Filling", price: "R30.00 p/kg", note: "Casings and spices excluded" },
  { label: "Biltong & Droëwors Drying", price: "R15.00 p/kg", note: "If space is available" },
  {
    label: "Vacuum/Fomo Packaging",
    price: "R3.00 p/p",
    note: "Salami, cabanossi, cheesegrillers, and all smoked products.",
  },
  { label: "Storage Fees", price: "R200.00 p/d", note: "Fees per day after 2 days notice." },
]

export function PriceList() {
  return (
    <section className="mb-12 md:mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
        Game Processing Price List 2025
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Whole Carcass Column */}
        <div>
          <h3 className="text-xl font-bold text-brand-red mb-6 uppercase">Processing Of Whole Carcasses</h3>
          <div className="space-y-4">
            {WHOLE_CARCASS.map((item, index) => (
              <div key={index} className="border-b border-dotted border-border/40 pb-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <span className="text-foreground font-bold block mb-1">{item.label}</span>
                    <p className="text-sm text-muted-foreground">{item.note}</p>
                  </div>
                  <span className="bg-black text-white font-bold text-sm px-3 py-1 whitespace-nowrap">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processed Carcass Column */}
        <div>
          <h3 className="text-xl font-bold text-brand-red mb-6 uppercase">Processed Carcasses</h3>
          <div className="space-y-4">
            {PROCESSED_CARCASS.map((item, index) => (
              <div key={index} className="border-b border-dotted border-border/40 pb-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <span className="text-foreground font-bold block mb-1">{item.label}</span>
                    <p className="text-sm text-muted-foreground">{item.note}</p>
                  </div>
                  <span className="bg-black text-white font-bold text-sm px-3 py-1 whitespace-nowrap">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Please Note Box */}
      <div className="border-l-4 border-brand-red bg-white/50 p-6">
        <h3 className="text-lg font-bold text-brand-red mb-3 uppercase">Please Note</h3>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {`We process your game meat to your specifications, but we do not assume any liability for any negligence on your part. Once your game is ready, we will promptly notify you. Please arrange to collect your processed game meat within 2 days; otherwise, a storage fee of R200 will be added to your bill. We appreciate your understanding that game processing is a time-consuming process, and we operate on a first-come, first-serve basis. Your return in processed game meat will be equal to the weight of game you bring in (e.g., 10kg of game in = 10kg of processed game meat out from Hokaai). All uncollected items will be disposed of after 2 days.`}
        </p>
      </div>
    </section>
  )
}
