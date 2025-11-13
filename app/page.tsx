import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroBanner } from "@/components/hero-banner"
import { DeliCategoryGrid } from "@/components/deli-category-grid"
import { OccasionTiles } from "@/components/occasion-tiles"
import { PromoBand } from "@/components/promo-band"
import { NewsletterManager } from "@/components/newsletter-popup"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { WavyDivider } from "@/components/wavy-divider"
import { sampleReviews, occasionTags } from "@/lib/data"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Banner */}
        <HeroBanner />

        {/* Promo Band */}
        <PromoBand />

        {/* Shop by Occasion */}
        <section className="py-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="lg:max-w-[65%] lg:mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-h2 text-brand-primary mb-4">Shop by Occasion</h2>
                <p className="text-body text-slate-700 max-w-2xl mx-auto">
                  Find the perfect cuts for every cooking style and occasion
                </p>
              </div>
              <OccasionTiles occasions={occasionTags} />
            </div>
          </div>
        </section>

        <WavyDivider />

        {/* Featured Collection: Deli & Biltong */}
        <section className="py-16 section-alt">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="lg:max-w-[65%] lg:mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-h2 text-brand-primary mb-4">Deli & Biltong</h2>
                <p className="text-body text-slate-700 max-w-2xl mx-auto">
                  Traditional South African dried meats and deli specialties
                </p>
              </div>
              <DeliCategoryGrid />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 section-alt">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-h2 text-brand-primary mb-4">What Our Customers Say</h2>
              <p className="text-body text-slate-700 max-w-2xl mx-auto">
                Hear from our satisfied customers about their experience with Hokaai Meat Market
              </p>
            </div>
            <TestimonialCarousel reviews={sampleReviews} />
          </div>
        </section>
      </main>

      <Footer />

      <NewsletterManager />
    </div>
  )
}
