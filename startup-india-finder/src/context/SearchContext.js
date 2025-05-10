"use client"

import { createContext, useContext, useState } from "react"

// Create context
const SearchContext = createContext({
  searchQuery: "",
  setSearchQuery: () => {},
})

// Search provider
export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("")

  return <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>{children}</SearchContext.Provider>
}

// Hook to use search context
export function useSearchContext() {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider")
  }

  return context
}
