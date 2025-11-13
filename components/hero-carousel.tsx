"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"

const ChevronLeft = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

interface Slide {
  id: number
  href: string
  image: string
  alt: string
}

const slides: Slide[] = [
  {
    id: 1,
    href: "/collections/all?filter.p.m.custom.meat_type=Beef",
    image: "/promo-premium-beef-banner.jpg",
    alt: "Premium Quality Meats - Shop Now",
  },
  {
    id: 2,
    href: "/collections/all?filter.p.m.custom.occasion=Braai",
    image: "/promo-weekly-specials-banner.jpg",
    alt: "This Week's Specials - View Deals",
  },
  {
    id: 3,
    href: "/collections/all?filter.p.m.custom.meat_type=Hampers%20%26%20Value%20Packs",
    image: "/promo-hampers-banner.jpg",
    alt: "Perfect Hampers - Shop Collection",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    goToSlide(index)
  }

  return (
    <div className="relative overflow-hidden">
      <div className="h-[280px] sm:h-[320px] lg:h-[380px] relative">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link href={slide.href} className="block w-full h-full">
              <div
                className="w-full h-full bg-cover bg-center relative cursor-pointer hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundColor: "#8B5A3C", // Fallback color
                }}
              >
                <img src={slide.image || "/placeholder.svg"} alt={slide.alt} className="sr-only" />
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-red-600 bg-opacity-90 hover:bg-opacity-100 text-white p-1.5 sm:p-2 rounded-full transition-all hidden sm:block z-10 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-red-600 bg-opacity-90 hover:bg-opacity-100 text-white p-1.5 sm:p-2 rounded-full transition-all hidden sm:block z-10 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => handleDotClick(e, index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
