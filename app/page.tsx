"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroBanner } from "@/components/hero-banner"
import { DeliCategoryGrid } from "@/components/deli-category-grid"
import { OccasionTiles } from "@/components/occasion-tiles"
import { PromoBand } from "@/components/promo-band"
import { NewsletterPopup } from "@/components/newsletter-popup"
import { FloatingActionStack } from "@/components/floating-action-stack"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { WavyDivider } from "@/components/wavy-divider"
import { sampleReviews, occasionTags } from "@/lib/data"

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    const hasSignedUp = localStorage.getItem("newsletter-signed-up") === "true"
    const hasSeenPopup = localStorage.getItem("newsletter-popup-seen") === "true"

    if (!hasSignedUp) {
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowPopup(true)
        }, 3000)

        return () => clearTimeout(timer)
      } else {
        setShowFloatingButton(true)
      }
    }
  }, [])

  const handleSignupComplete = () => {
    setShowPopup(false)
    setShowFloatingButton(false)
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    setShowFloatingButton(true)
  }

  const handleFloatingButtonClick = () => {
    setShowFloatingButton(false)
    setShowPopup(true)
  }

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
                  Find the perfect cuts for every cooking style and occasion
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

      {showPopup && <NewsletterPopup onSignupComplete={handleSignupComplete} onClose={handlePopupClose} />}

      <FloatingActionStack showNewsletter={showFloatingButton} onNewsletterClick={handleFloatingButtonClick} />
    </div>
  )
}
