"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types"

interface ProductGalleryProps {
  product: Product
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // For demo purposes, create multiple images from the main image
  const images = product.images || [product.image, product.image, product.image]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative overflow-hidden rounded-2xl bg-slate-100">
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? "border-brand-red" : "border-slate-300"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.title} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
