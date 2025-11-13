"use client"

import { useState } from "react"
import Link from "next/link"
import type { NavItem } from "@/lib/types"
import { getViewAllUrlFromMapping } from "@/lib/view-all-mappings"

const XIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

interface MobileMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: NavItem[]
}

const BUTCHERY_VIEW_ALL_URLS: Record<string, string> = {
  Beef: getViewAllUrlFromMapping("View All Beef"),
  Lamb: getViewAllUrlFromMapping("View All Lamb"),
  Pork: getViewAllUrlFromMapping("View All Pork"),
  Chicken: getViewAllUrlFromMapping("View All Chicken"),
  "Wors & Sausages": getViewAllUrlFromMapping("View All Wors & Sausages"),
  Sosaties: getViewAllUrlFromMapping("View All Sosaties"),
  "Bacon Rashers & Ham": getViewAllUrlFromMapping("View All Bacon Rashers & Ham"),
  "Hampers & Value Packs": getViewAllUrlFromMapping("View All Hampers & Value Packs"),
}

const OTHER_COLLECTION_URLS: Record<string, string> = {
  "Deli & Biltong": getViewAllUrlFromMapping("View All Deli & Biltong"),
  "Spices & Sauces": getViewAllUrlFromMapping("View All Spices & Sauces"),
  "Braai Gear": getViewAllUrlFromMapping("View All Braai Gear"),
  Groceries: getViewAllUrlFromMapping("View All Groceries"),
}

export function MobileMenuDrawer({ isOpen, onClose, navigationItems }: MobileMenuDrawerProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-50 lg:hidden overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gradient-to-r from-black via-red-800 to-black">
          <img src="/images/hokaai-logo.png" alt="Hokaai Meat Market" className="h-6 w-auto" />
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-red-400 transition-colors"
            aria-label="Close menu"
          >
            <XIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {/* Account Link */}
          <Link
            href="/account"
            className="flex items-center space-x-3 py-3 text-slate-700 hover:text-brand-primary transition-colors border-b border-slate-200"
            onClick={onClose}
          >
            <UserIcon />
            <span>My Account</span>
          </Link>

          {/* Navigation Items */}
          <div className="mt-4 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.items ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className="flex items-center justify-between w-full py-3 text-left text-slate-700 hover:text-brand-primary transition-colors"
                    >
                      <span className="font-medium">{item.title}</span>
                      {expandedItems.includes(item.title) ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </button>

                    {expandedItems.includes(item.title) && (
                      <div className="ml-4 space-y-2">
                        {item.title === "Shop" && (
                          <>
                            <Link
                              href="/collections/all"
                              className="block py-2 text-brand-primary hover:text-brand-red transition-colors font-medium border-b border-slate-200 mb-3 pb-3"
                              onClick={onClose}
                            >
                              Shop All →
                            </Link>

                            {/* Butchery Section */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-sm text-brand-primary uppercase tracking-wide mb-2">
                                Butchery
                              </h4>
                              <div className="space-y-1">
                                {Object.entries(BUTCHERY_VIEW_ALL_URLS).map(([title, url]) => (
                                  <Link
                                    key={title}
                                    href={url}
                                    className="block py-2 text-slate-700 hover:text-brand-primary transition-colors"
                                    onClick={onClose}
                                  >
                                    {title}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Other Collections */}
                            <div className="space-y-1">
                              {Object.entries(OTHER_COLLECTION_URLS).map(([title, url]) => (
                                <Link
                                  key={title}
                                  href={url}
                                  className="block py-2 text-slate-700 hover:text-brand-primary transition-colors"
                                  onClick={onClose}
                                >
                                  {title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                        {item.title === "Shop by Occasion" && (
                          <Link
                            href="/collections/all"
                            className="block py-2 text-brand-primary hover:text-brand-red transition-colors font-medium border-b border-slate-200 mb-3 pb-3"
                            onClick={onClose}
                          >
                            View All Shop by Occasion →
                          </Link>
                        )}
                        {item.title !== "Shop" &&
                          item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href || "#"}
                              className="block py-2 text-slate-700 hover:text-brand-primary transition-colors"
                              onClick={onClose}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="block py-3 text-slate-700 hover:text-brand-primary font-medium transition-colors"
                    onClick={onClose}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}
