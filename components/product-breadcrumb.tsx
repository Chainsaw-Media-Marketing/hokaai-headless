"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductBreadcrumb() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref")

  const handleBack = () => {
    if (ref) {
      // Navigate to the filtered collection URL
      router.push(ref)
    } else {
      // Fallback to browser back
      router.back()
    }
  }

  return (
    <div className="mb-6">
      <Button variant="ghost" onClick={handleBack} className="text-brand-primary hover:text-brand-red -ml-2">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Collection
      </Button>
    </div>
  )
}
