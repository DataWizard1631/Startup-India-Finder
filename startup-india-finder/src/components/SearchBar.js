"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SearchProvider, useSearchContext } from "@/context/SearchContext"

function SearchBarInner() {
  const { searchQuery, setSearchQuery } = useSearchContext()

  // Debounce search input
  const [inputValue, setInputValue] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, setSearchQuery])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search schemes, hackathons, and more..."
        className="pl-10 w-full"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  )
}

export default function SearchBar() {
  return (
    <SearchProvider>
      <SearchBarInner />
    </SearchProvider>
  )
}
