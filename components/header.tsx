"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { MegaMenu } from "./mega-menu"
import { MobileMenuDrawer } from "./mobile-menu-drawer"
import { SearchOverlay } from "./search-overlay"
import { CartDrawer } from "./cart-drawer"
import { SocialIcons } from "./social-icons"
import { navigationItems } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { goToAccount } from "@/lib/shopifyClient"

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const MenuIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  const { state: cartState, dispatch } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  let closeTimer: NodeJS.Timeout

  const handleMouseEnter = (title: string) => {
    if (closeTimer) clearTimeout(closeTimer)
    setActiveDropdown(title)
  }

  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-gradient-to-r from-black via-red-800 to-black border-b border-gray-700 shadow-lg transition-all duration-500 ease-in-out ${
          isScrolled ? "h-12" : "h-12 lg:h-auto"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="transition-all duration-500 ease-in-out">
            <div
              className={`flex items-center transition-all duration-500 ease-in-out ${
                isScrolled ? "justify-between h-12" : "justify-between h-12 lg:justify-between lg:h-16 xl:h-20"
              }`}
            >
              <div
                className={`flex items-center transition-all duration-500 ease-in-out ${
                  isScrolled ? "space-x-4" : "space-x-4 lg:space-x-0"
                }`}
              >
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-white hover:text-red-400 transition-all duration-500 ease-in-out"
                  aria-label="Search"
                >
                  <SearchIcon />
                </button>

                <Link
                  href="/"
                  className={`flex-shrink-0 transition-all duration-500 ease-in-out hover:opacity-80 cursor-pointer relative z-20 ${
                    isScrolled ? "" : "lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2"
                  }`}
                >
                  <img
                    src="/images/hokaai-logo.png"
                    alt="Hokaai Meat Market"
                    className={`w-auto transition-all duration-500 ease-in-out ${
                      isScrolled ? "h-10" : "h-10 lg:h-14 xl:h-20"
                    }`}
                  />
                </Link>
              </div>

              <nav
                className={`hidden lg:flex items-center justify-center ${
                  isScrolled
                    ? "opacity-100 absolute inset-x-0 mx-auto w-full pointer-events-none"
                    : "opacity-0 pointer-events-none absolute left-1/2 transform -translate-x-1/2"
                }`}
              >
                <div className="flex items-center space-x-8 whitespace-nowrap pointer-events-auto">
                  {navigationItems.map((item) => (
                    <div key={item.title} className="relative">
                      {item.items ? (
                        <div
                          className="relative"
                          onMouseEnter={() => handleMouseEnter(item.title)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <button className="text-white hover:text-red-400 font-heading font-medium transition-colors py-2">
                            {item.title}
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={item.href || "#"}
                          className="text-white hover:text-red-400 font-heading font-medium transition-colors py-2"
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </nav>

              <div
                className={`flex items-center transition-all duration-500 ease-in-out ${
                  isScrolled ? "space-x-3" : "space-x-3 lg:space-x-4"
                }`}
              >
                <div className="hidden sm:flex">
                  <SocialIcons className="text-white" size={20} />
                </div>

                <button
                  onClick={() => goToAccount()}
                  className="hidden sm:flex p-2 text-white hover:text-red-400 transition-colors"
                  aria-label="Account"
                >
                  <UserIcon />
                </button>

                <button
                  onClick={() => dispatch({ type: "TOGGLE_CART" })}
                  className="relative p-2 text-white hover:text-red-400 transition-colors"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {cartState.itemCount > 9 ? "9+" : cartState.itemCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-white hover:text-red-400 transition-colors"
                  aria-label="Open menu"
                >
                  <MenuIcon />
                </button>
              </div>
            </div>

            <div
              className={`hidden lg:block ${
                isScrolled ? "opacity-0 h-0 overflow-hidden pointer-events-none" : "opacity-100 py-1"
              }`}
            >
              <nav className="flex items-center justify-center space-x-8 py-1">
                {navigationItems.map((item) => (
                  <div key={item.title} className="relative">
                    {item.items ? (
                      <div
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.title)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <button className="text-white hover:text-red-400 font-heading font-medium transition-colors py-2 px-2">
                          {item.title}
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className="text-white hover:text-red-400 font-heading font-medium transition-colors py-2"
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {activeDropdown && (
          <div
            className={`fixed left-0 right-0 z-50 ${
              activeDropdown === "Shop"
                ? isScrolled
                  ? "top-12"
                  : "top-12 lg:top-24"
                : isScrolled
                  ? "top-12"
                  : "top-12 lg:top-28"
            }`}
            onMouseEnter={() => handleMouseEnter(activeDropdown)}
            onMouseLeave={handleMouseLeave}
          >
            <MegaMenu
              items={navigationItems.find((item) => item.title === activeDropdown)?.items || []}
              title={activeDropdown}
              onClose={() => setActiveDropdown(null)}
            />
          </div>
        )}
      </header>

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <CartDrawer />
    </>
  )
}

export { Header }
export default Header
