import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroBanner() {
  return (
    <Link href="/collections/all" className="block relative overflow-hidden group">
      <div className="h-[220px] sm:h-[320px] lg:h-[380px] relative">
        {/* Mobile version - zoomed in more */}
        <div
          className="w-full h-full bg-cover relative transition-transform duration-500 group-hover:scale-[1.025] sm:hidden"
          style={{
            backgroundImage: `url(/hero-banner-mobile.webp)`,
            backgroundColor: "#8B5A3C",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-start justify-center">
            <div className="container mx-auto px-6 pt-10 pb-8">
              <div className="text-center">
                <h1 className="text-h1 max-sm:text-3xl font-bold text-white mb-3 text-balance [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
                  Premium Quality Meats
                </h1>
                <p className="text-base sm:text-xl text-white/90 mb-6 text-pretty [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
                  Fresh cuts & braai essentials
                </p>

                <div className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg group-hover:shadow-xl">
                  <span>Go to Shop</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop version - original positioning */}
        <div
          className="w-full h-full bg-cover relative transition-transform duration-500 group-hover:scale-[1.025] hidden sm:block"
          style={{
            backgroundImage: `url(/homepage-hero-banner.webp), url(/homepage-hero-banner.jpg)`,
            backgroundColor: "#8B5A3C",
            backgroundPosition: "left 40%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-start sm:items-center justify-center">
            <div className="container mx-auto px-6 lg:px-8 pt-10 pb-8">
              <div className="max-w-2xl">
                <h1 className="text-h1 font-bold text-white mb-4 text-balance [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
                  Premium Quality Meats
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-8 text-pretty [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
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
