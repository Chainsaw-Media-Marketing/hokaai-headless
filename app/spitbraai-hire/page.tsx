import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/spitbraai/Hero"
import { Pillars } from "@/components/spitbraai/Pillars"
import { PriceList } from "@/components/spitbraai/PriceList"
import { SpitHireForm } from "@/components/spitbraai/SpitHireForm"
import { WavyDivider } from "@/components/wavy-divider"

export const metadata = {
  title: "Spitbraai Hire in Pretoria | Hokaai Meat Market",
  description:
    "Professional spitbraai hire services in Pretoria. Quality equipment, expert guidance, and add-ons for your perfect braai event.",
}

export default function SpitbraaiHirePage() {
  const whatsappNumber = "27633018293"

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />

        <div className="bg-background py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Intro Section */}
            <div className="lg:w-[70%] lg:mx-auto">
              <section className="mb-12 md:mb-16 text-center">
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide font-medium">
                  Everything you need for the perfect braai
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-red mb-4">Spitbraai Hire in Pretoria</h2>
                <p className="text-base text-foreground/90 leading-relaxed max-w-4xl mx-auto">
                  At Hokaai Meat Market, we offer professional spitbraai hire services to make your event unforgettable.
                  Whether you're hosting a family gathering, corporate event, or celebration, our quality equipment and
                  expert guidance ensure your braai is a success. We provide everything you need to create an authentic
                  South African spitbraai experience.
                </p>
              </section>

              <Pillars />
            </div>
          </div>
        </div>

        <WavyDivider topColor="var(--background)" bottomColor="var(--muted)" />

        <div className="bg-muted py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Price List */}
            <div className="lg:w-[70%] lg:mx-auto">
              <PriceList />
            </div>

            {/* Booking Form */}
            <div className="flex justify-center">
              <SpitHireForm whatsappNumber={whatsappNumber} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
