const PILLARS = [
  {
    number: "1.",
    title: "Butchering And Processing:",
    body: "Our skilled butchers are experienced in processing a wide range of game animals, including impala, kudu, springbok, and more. We handle each animal with care, ensuring minimal waste and maximum yield.",
    icon: "/crossed-butcher-knives-icon-red-on-black-circle.jpg",
  },
  {
    number: "2.",
    title: "Quality Assurance:",
    body: "We maintain the highest standards of hygiene and quality control. Our facility is equipped with state-of-the-art equipment to ensure that your game meat is processed with precision and safety in mind.",
    icon: "/checkmark-quality-approved-icon-red-on-black-circl.jpg",
  },
  {
    number: "3.",
    title: "Customization:",
    body: "We offer a variety of processing options to suit your culinary needs. Whether you prefer steaks, sausages, biltong, or unique game meat recipes, we can customize the processing to your exact specifications.",
    icon: "/meat-cut-steak-icon-red-on-black-circle.jpg",
  },
  {
    number: "4.",
    title: "Packaging and Storage:",
    body: "We provide efficient packaging solutions, making it easy for you to store your processed game meat in the freezer or enjoy it immediately. Our packaging ensures the preservation of flavor and freshness.",
    icon: "/package-box-storage-icon-red-on-black-circle.jpg",
  },
]

export function Pillars() {
  return (
    <section className="mb-12 md:mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
