const PILLARS = [
  {
    number: "1.",
    title: "Quality Equipment:",
    body: "Our spitbraai units are well-maintained and reliable. We offer both Big Spit and Mini Spit options to suit events of all sizes, from intimate gatherings to large celebrations.",
    icon: "/braai-equipment-icon-red-on-black-circle.jpg",
  },
  {
    number: "2.",
    title: "Expert Guidance:",
    body: "Not sure how to use a spit? No problem. We provide clear instructions and tips to help you achieve perfectly cooked meat every time. Our team is always available to answer questions.",
    icon: "/expert-guidance-icon-red-on-black-circle.jpg",
  },
  {
    number: "3.",
    title: "Add-Ons Available:",
    body: "Enhance your braai with our selection of add-ons including premium meats, marinades, spices, and accessories. We can help you create a complete braai package tailored to your needs.",
    icon: "/add-ons-extras-icon-red-on-black-circle.jpg",
  },
]

export function Pillars() {
  return (
    <section className="mb-12 md:mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {PILLARS.map((pillar, index) => (
          <div key={index} className="text-center">
            <div className="w-20 h-20 mx-auto mb-4">
              <img
                src={pillar.icon || "/placeholder.svg"}
                alt={pillar.title}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Numbered title */}
            <h3 className="text-base font-bold text-foreground mb-3">
              {pillar.number} {pillar.title}
            </h3>

            {/* Body text */}
            <p className="text-sm text-foreground/80 leading-relaxed">{pillar.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
