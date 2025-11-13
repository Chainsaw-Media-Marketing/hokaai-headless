"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function RecipeScrollManager() {
  const pathname = usePathname()

  useEffect(() => {
    // Only run on recipes page
    if (pathname !== "/recipes") return

    // Restore scroll position when returning to recipes page
    const savedPosition = sessionStorage.getItem("recipes-scroll-position")
    if (savedPosition) {
      const position = Number.parseInt(savedPosition, 10)
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior: "instant" as ScrollBehavior,
        })
      }, 0)
      // Clear the saved position after restoring
      sessionStorage.removeItem("recipes-scroll-position")
    }

    // Save scroll position before navigating away
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="/recipes/"]')
      if (link && link.getAttribute("href") !== "/recipes") {
        sessionStorage.setItem("recipes-scroll-position", window.scrollY.toString())
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [pathname])

  return null
}
