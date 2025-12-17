export function Hero() {
  return (
    <div className="relative overflow-hidden min-h-[260px] md:min-h-[340px]">
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/spitbraai-hero.webp" type="image/webp" />
          <img
            src="/spitbraai-hero.jpg"
            alt="Spitbraai Hire"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 35%",
            }}
          />
        </picture>
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* </CHANGE> */}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <h1 className="text-h1 max-sm:text-3xl text-white mb-4">Spitbraai Hire in Pretoria</h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl">
          Quality equipment, expert guidance, and everything you need for an unforgettable braai experience.
        </p>
      </div>
    </div>
  )
}
