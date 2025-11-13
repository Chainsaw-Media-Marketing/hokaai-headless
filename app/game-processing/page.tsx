import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/game-processing/Hero"
import { Pillars } from "@/components/game-processing/Pillars"
import { PriceList } from "@/components/game-processing/PriceList"
import { BookingForm } from "@/components/game-processing/BookingForm"
import { WavyDivider } from "@/components/wavy-divider"

export const metadata = {
  title: "Game Processing in Pretoria & Centurion | Hokaai Meat Market",
  description:
    "Professional game processing services in Pretoria & Centurion. Expert butchering, quality assurance, and custom processing from field to table.",
}

export default function GameProcessingPage() {
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
                  We are hunters ourselves and know what it's about
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-red mb-4">
                  Game Processing In Pretoria & Centurion
                </h2>
                <p className="text-base text-foreground/90 leading-relaxed max-w-4xl mx-auto">
                  At Hokaai Meat Market, we take pride in offering expert game processing services that cater to the
                  rich hunting culture of South Africa. We understand the value of your game and the importance of
                  preserving its quality from field to table. With our top-notch game processing, your wild game meat
                  will be transformed into culinary delights that are both delicious and nutritious.
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
              <BookingForm whatsappNumber={whatsappNumber} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
