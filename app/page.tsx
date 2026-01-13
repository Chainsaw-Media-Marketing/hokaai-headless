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
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hokaai Meat Market - Premium Quality Meats, Deli & Biltong | Online Delivery in Gauteng",
  description:
    "Order premium quality meats, deli and biltong online from Hokaai Meat Market in Pretoria. Local delivery in Gauteng. Fresh cuts, braai essentials and bulk hampers. Free delivery in Pretoria & Centurion on orders over R1,000.",
  openGraph: {
    title: "Hokaai Meat Market - Premium Quality Meats, Deli & Biltong",
    description:
      "Order premium quality meats, deli and biltong online from Pretoria. Local delivery in Gauteng. Fresh cuts, braai essentials and bulk hampers.",
  },
  twitter: {
    title: "Hokaai Meat Market - Premium Quality Meats, Deli & Biltong",
    description:
      "Order premium quality meats, deli and biltong online from Pretoria. Local delivery in Gauteng. Fresh cuts, braai essentials and bulk hampers.",
  },
}

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
        <section className="py-8 lg:py-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="lg:max-w-[65%] lg:mx-auto">
              <div className="text-center mb-8 lg:mb-12">
                <h2 className="text-h2 max-sm:text-2xl text-brand-primary mb-2 lg:mb-4">Shop by Occasion</h2>
                <p className="text-body text-slate-700 max-w-2xl mx-auto hidden lg:block">
                  Find the perfect cuts for every cooking style and occasion. Serving Pretoria, Centurion and
                  surrounding areas.
                </p>
              </div>
              <OccasionTiles occasions={occasionTags} />
            </div>
          </div>
        </section>

        {/* Mobile-only wavy divider between Shop by Occasion and Deli sections */}
        <div className="lg:hidden">
          <WavyDivider height={50} />
        </div>

        <div className="hidden lg:block">
          <WavyDivider />
        </div>

        {/* Featured Collection: Deli & Biltong */}
        <section className="py-8 lg:py-16 section-alt">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="lg:max-w-[65%] lg:mx-auto">
              <div className="text-center mb-8 lg:mb-12">
                <h2 className="text-h2 max-sm:text-2xl text-brand-primary mb-2 lg:mb-4">Deli & Biltong</h2>
                <p className="text-body text-slate-700 max-w-2xl mx-auto hidden lg:block">
                  Traditional South African dried meats and deli specialties
                </p>
              </div>
              <DeliCategoryGrid />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-8 lg:py-16 section-alt">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-h2 max-sm:text-2xl text-brand-primary mb-2 lg:mb-4">What Our Customers Say</h2>
              <p className="text-body text-slate-700 max-w-2xl mx-auto hidden lg:block">
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
