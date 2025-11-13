const SPIT_PRODUCTS = [
  {
    name: "Big Spit braai Hire",
    capacity: "Feeds 80-100 people",
    withMeatPrice: "R850.00",
    withoutMeatPrice: "R1,000.00",
    description:
      "Perfect for large events, corporate functions, and celebrations. Includes full setup instructions and support.",
    features: ["Heavy-duty construction", "Easy to operate", "Includes drip tray", "Setup guide provided"],
  },
  {
    name: "Mini Spit Braai",
    capacity: "Feeds 30-40 people",
    withMeatPrice: "R550.00",
    withoutMeatPrice: "R750.00",
    description:
      "Ideal for family gatherings and smaller events. Compact yet powerful, delivering the same great results.",
    features: ["Compact design", "Easy to transport", "Includes drip tray", "Setup guide provided"],
  },
]

export function PriceList() {
  return (
    <section className="mb-12 md:mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">Spitbraai Hire Price List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {SPIT_PRODUCTS.map((product, index) => (
          <div key={index} className="rounded-2xl border border-border/40 bg-white/5 p-6">
            <h3 className="text-2xl font-bold text-brand-red mb-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{product.capacity}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start justify-between gap-4">
                <span className="text-foreground text-sm leading-relaxed">(If meat is purchased from Hokaai)</span>
                <span className="bg-black text-white font-bold text-lg px-4 py-1 whitespace-nowrap">
                  {product.withMeatPrice}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-foreground text-sm leading-relaxed">(If no meat is purchased at Hokaai)</span>
                <span className="bg-black text-white font-bold text-lg px-4 py-1 whitespace-nowrap">
                  {product.withoutMeatPrice}
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{product.description}</p>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Includes:</p>
              <ul className="space-y-1">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-foreground/70 flex items-start">
                    <span className="text-brand-red mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-4 border-brand-red bg-white/50 p-6">
        <p className="text-sm text-foreground/90 leading-relaxed">
          Pricing excludes deposit and cleaning charges where applicable. Subject to availability.
        </p>
      </div>
    </section>
  )
}
