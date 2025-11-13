export function Hero() {
  return (
    <div className="relative overflow-hidden min-h-[260px] md:min-h-[340px]">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img src="/spitbraai-fire-and-equipment-at-sunset.jpg" alt="Spitbraai Hire" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <h1 className="text-white text-3xl md:text-5xl font-semibold mb-4">Spitbraai Hire in Pretoria</h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl">
          Quality equipment, expert guidance, and everything you need for an unforgettable braai experience.
        </p>
      </div>
    </div>
  )
}
