import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroBanner() {
  return (
    <Link href="/collections/all" className="block relative overflow-hidden group">
      <div className="h-[280px] sm:h-[320px] lg:h-[380px] relative">
        {/* Mobile version - zoomed in more (25%) */}
        <div
          className="w-full h-full bg-cover relative transition-transform duration-500 group-hover:scale-[1.025] sm:hidden"
          style={{
            backgroundImage: `url(/hero-shop-banner.jpg)`,
            backgroundColor: "#8B5A3C",
            backgroundPosition: "center 25%",
          }}
        >
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
                  Premium Quality Meats
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-8 text-pretty">
                  Discover our full range of fresh cuts, deli specialties, and braai essentials
                </p>

                <div className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg group-hover:shadow-xl">
                  <span>Go to Shop</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop version - original positioning (35%) */}
        <div
          className="w-full h-full bg-cover relative transition-transform duration-500 group-hover:scale-[1.025] hidden sm:block"
          style={{
            backgroundImage: `url(/hero-shop-banner.jpg)`,
            backgroundColor: "#8B5A3C",
            backgroundPosition: "center 35%",
          }}
        >
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
                  Premium Quality Meats
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-8 text-pretty">
                  Discover our full range of fresh cuts, deli specialties, and braai essentials
                </p>

                <div className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg group-hover:shadow-xl">
                  <span>Go to Shop</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
