"use client"

import { useState } from "react"

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters)

  // Update a specific filter
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return { filters, updateFilter, resetFilters }
}
