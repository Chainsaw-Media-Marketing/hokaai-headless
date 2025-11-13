"use client"

import { useEffect, useRef } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import type { FilterState } from "@/lib/filter-utils"
import { getVisibleFilterGroups, getFilterDisplayLabel } from "@/lib/filter-utils"

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterGroup {
  key: keyof FilterState
  title: string
  options: FilterOption[]
}

interface CollectionFilterSidebarProps {
  // Pre-selected filters based on collection
  initialFilters?: FilterState
  // Available filter options with counts
  availableFilters: {
    meatTypes: FilterOption[]
    cutFamilies: FilterOption[]
    occasions: FilterOption[]
    departments: FilterOption[]
    deliTypes: FilterOption[]
    spiceFamilies: FilterOption[]
    braaiGearFamilies: FilterOption[]
    groceryFamilies: FilterOption[]
    bulkTypes: FilterOption[]
  }
  // Callback when filters change
  onFiltersChange: (filters: FilterState) => void
  collectionHandle?: string
}

export function CollectionFilterSidebar({
  initialFilters,
  availableFilters,
  onFiltersChange,
  collectionHandle,
}: CollectionFilterSidebarProps) {
  const router = useRouter()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(collectionHandle === "all" ? ["Department"] : [])
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(
    initialFilters || {
      meatType: [],
      cutFamily: [],
      occasion: [],
      department: [],
      deliType: [],
      spiceFamily: [],
      braaiGearFamily: [],
      groceryFamily: [],
      bulkType: [],
    },
  )
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isUpdatingFromParent = useRef(false)
  const previousFiltersRef = useRef<string>(JSON.stringify(selectedFilters))

  useEffect(() => {
    if (initialFilters) {
      isUpdatingFromParent.current = true
      setSelectedFilters(initialFilters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialFilters)])

  useEffect(() => {
    const currentFiltersString = JSON.stringify(selectedFilters)

    if (isUpdatingFromParent.current) {
      isUpdatingFromParent.current = false
      previousFiltersRef.current = currentFiltersString
      return
    }

    if (previousFiltersRef.current === currentFiltersString) {
      return
    }

    previousFiltersRef.current = currentFiltersString
    onFiltersChange(selectedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters])

  const filterGroups: FilterGroup[] = [
    {
      key: "department",
      title: "Department",
      options: availableFilters.departments,
    },
    {
      key: "meatType",
      title: "Meat Type",
      options: availableFilters.meatTypes,
    },
    {
      key: "cutFamily",
      title: "Cut Type",
      options: availableFilters.cutFamilies,
    },
    {
      key: "deliType",
      title: "Deli Type",
      options: availableFilters.deliTypes,
    },
    {
      key: "spiceFamily",
      title: "Spice Type",
      options: availableFilters.spiceFamilies,
    },
    {
      key: "braaiGearFamily",
      title: "Braai Gear Type",
      options: availableFilters.braaiGearFamilies,
    },
    {
      key: "groceryFamily",
      title: "Grocery Type",
      options: availableFilters.groceryFamilies,
    },
    {
      key: "bulkType",
      title: "Bulk Type",
      options: availableFilters.bulkTypes,
    },
    {
      key: "occasion",
      title: "Occasion",
      options: availableFilters.occasions,
    },
  ]

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle) ? prev.filter((g) => g !== groupTitle) : [...prev, groupTitle],
    )
  }

  const toggleFilter = (groupKey: keyof FilterState, filterValue: string) => {
    setSelectedFilters((prev) => {
      if (groupKey === "department") {
        // If clicking the same department, deselect it
        if (prev.department.includes(filterValue)) {
          return {
            ...prev,
            department: [],
            meatType: [],
            cutFamily: [],
            occasion: [],
            deliType: [],
            spiceFamily: [],
            braaiGearFamily: [],
            groceryFamily: [],
            bulkType: [],
          }
        }
        // Otherwise, set this as the only department and clear incompatible family facets
        return {
          ...prev,
          department: [filterValue],
          meatType: [],
          cutFamily: [],
          occasion: [],
          deliType: [],
          spiceFamily: [],
          braaiGearFamily: [],
          groceryFamily: [],
          bulkType: [],
        }
      }

      // For all other filters, use multi-select (checkbox) behavior
      const current = prev[groupKey]
      const updated = current.includes(filterValue)
        ? current.filter((f) => f !== filterValue)
        : [...current, filterValue]

      return { ...prev, [groupKey]: updated }
    })
  }

  const clearAllFilters = () => {
    const emptyFilters = {
      meatType: [],
      cutFamily: [],
      occasion: [],
      department: [],
      deliType: [],
      spiceFamily: [],
      braaiGearFamily: [],
      groceryFamily: [],
      bulkType: [],
    }

    setSelectedFilters(emptyFilters)
    previousFiltersRef.current = JSON.stringify(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const removeFilter = (groupKey: keyof FilterState, filterValue: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey].filter((f) => f !== filterValue),
    }))
  }

  const totalActiveFilters =
    selectedFilters.meatType.length +
    selectedFilters.cutFamily.length +
    selectedFilters.occasion.length +
    selectedFilters.department.length +
    selectedFilters.deliType.length +
    selectedFilters.spiceFamily.length +
    selectedFilters.braaiGearFamily.length +
    selectedFilters.groceryFamily.length +
    selectedFilters.bulkType.length

  const activeDepartment = selectedFilters.department[0]

  const hasAnyActiveFilters = totalActiveFilters > 0
  const isAllCollection = collectionHandle === "all"

  let visibleGroupKeys: (keyof FilterState)[]
  if (isAllCollection && !hasAnyActiveFilters) {
    // On /collections/all with no active filters, show only Department
    visibleGroupKeys = ["department"]
  } else {
    // Otherwise, show Department + relevant family groups
    visibleGroupKeys = getVisibleFilterGroups(activeDepartment)
  }

  const visibleFilterGroups = filterGroups.filter((group) => visibleGroupKeys.includes(group.key))

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {totalActiveFilters > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-brand-primary">Active Filters</h3>
            <button onClick={clearAllFilters} className="text-sm text-brand-red hover:underline">
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(selectedFilters) as Array<keyof FilterState>).map((groupKey) =>
              selectedFilters[groupKey].map((filterValue) => (
                <span
                  key={`${groupKey}-${filterValue}`}
                  className="inline-flex items-center bg-brand-red text-white px-3 py-1 rounded-full text-sm"
                >
                  {getFilterDisplayLabel(filterValue)}
                  <button
                    onClick={() => removeFilter(groupKey, filterValue)}
                    className="ml-2 hover:bg-red-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )),
            )}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      {visibleFilterGroups.map((group) => (
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
                    type={group.key === "department" ? "radio" : "checkbox"}
                    name={group.key === "department" ? "department" : undefined}
                    checked={selectedFilters[group.key].includes(option.value)}
                    onChange={() => toggleFilter(group.key, option.value)}
                    className="rounded border-slate-400 text-brand-red focus:ring-brand-success"
                  />
                  <span className="text-slate-700 flex-1">{getFilterDisplayLabel(option.value)}</span>
                  {option.count !== undefined && <span className="text-slate-500 text-sm">({option.count})</span>}
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
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors font-medium w-full justify-center"
        >
          Filters
          {totalActiveFilters > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white text-brand-red rounded-full text-xs font-bold">
              {totalActiveFilters}
            </span>
          )}
        </button>
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
