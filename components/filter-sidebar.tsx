"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterGroup {
  title: string
  options: { value: string; label: string; count?: number }[]
}

const filterGroups: FilterGroup[] = [
  {
    title: "Meat Type",
    options: [
      { value: "beef", label: "Beef", count: 12 },
      { value: "lamb", label: "Lamb", count: 8 },
      { value: "pork", label: "Pork", count: 6 },
      { value: "chicken", label: "Chicken", count: 10 },
    ],
  },
  {
    title: "Cut Type",
    options: [
      { value: "steak", label: "Steaks", count: 8 },
      { value: "roast", label: "Roasts", count: 6 },
      { value: "mince", label: "Mince", count: 4 },
      { value: "chops", label: "Chops", count: 7 },
    ],
  },
  {
    title: "Occasion",
    options: [
      { value: "braai", label: "Braai", count: 15 },
      { value: "stew", label: "Stew", count: 8 },
      { value: "roast", label: "Roast", count: 6 },
      { value: "quick", label: "Quick & Easy", count: 10 },
    ],
  },
  {
    title: "Special",
    options: [
      { value: "marinated", label: "Marinated", count: 5 },
      { value: "organic", label: "Organic", count: 3 },
      { value: "premium", label: "Premium", count: 8 },
    ],
  },
]

export function FilterSidebar() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Meat Type", "Occasion"])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle) ? prev.filter((g) => g !== groupTitle) : [...prev, groupTitle],
    )
  }

  const toggleFilter = (filterValue: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterValue) ? prev.filter((f) => f !== filterValue) : [...prev, filterValue],
    )
  }

  const clearAllFilters = () => {
    setSelectedFilters([])
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-brand-primary">Active Filters</h3>
            <button onClick={clearAllFilters} className="text-sm text-brand-red hover:underline">
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map((filter) => {
              const filterOption = filterGroups.flatMap((g) => g.options).find((o) => o.value === filter)
              return (
                <span
                  key={filter}
                  className="inline-flex items-center bg-brand-red text-white px-3 py-1 rounded-full text-sm"
                >
                  {filterOption?.label}
                  <button onClick={() => toggleFilter(filter)} className="ml-2 hover:bg-red-700 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      {filterGroups.map((group) => (
        <div key={group.title} className="border-b border-slate-200 pb-4">
          <button
            onClick={() => toggleGroup(group.title)}
            className="flex items-center justify-between w-full text-left font-semibold text-brand-primary mb-3"
          >
            {group.title}
            {expandedGroups.includes(group.title) ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedGroups.includes(group.title) && (
            <div className="space-y-2">
              {group.options.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(option.value)}
                    onChange={() => toggleFilter(option.value)}
                    className="rounded border-slate-400 text-brand-red focus:ring-brand-success"
                  />
                  <span className="text-slate-700 flex-1">{option.label}</span>
                  {option.count && <span className="text-slate-500 text-sm">({option.count})</span>}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button onClick={() => setIsMobileOpen(true)} variant="secondary" className="w-full">
          Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <h2 className="font-heading font-semibold text-xl text-brand-primary mb-6">Filters</h2>
        <FilterContent />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50 lg:hidden overflow-y-auto">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-xl text-brand-primary">Filters</h2>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-slate-100 rounded">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </>
      )}
    </>
  )
}
