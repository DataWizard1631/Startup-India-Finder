"use client"

import { useState, useEffect } from "react"
import { Filter, Award } from "lucide-react"
import SchemeCard from "@/components/schemes/SchemeCard"
import FilterBar from "@/components/common/FilterBar"
import { useSearchContext } from "@/context/SearchContext"
import { useFilters } from "@/hooks/useFilters"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const { searchQuery } = useSearchContext()
  const { filters, updateFilter, resetFilters } = useFilters({
    sector: [],
    region: [],
    deadline: null,
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch("/api/schemes")
        const data = await res.json()
        setSchemes(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching schemes:", error)
        setLoading(false)
      }
    }

    fetchSchemes()
  }, [])

  // Filter schemes based on search query and filters
  const filteredSchemes = schemes.filter((scheme) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.sectorTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Sector filter
    const matchesSector = filters.sector.length === 0 || scheme.sectorTags.some((tag) => filters.sector.includes(tag))

    // Region filter
    const matchesRegion = filters.region.length === 0 || filters.region.includes(scheme.region)

    // Deadline filter
    const matchesDeadline = !filters.deadline || new Date(scheme.deadline) >= new Date(filters.deadline)

    return matchesSearch && matchesSector && matchesRegion && matchesDeadline
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSchemes = filteredSchemes.slice(startIndex, startIndex + itemsPerPage)

  // Get unique sectors and regions for filters
  const sectors = [...new Set(schemes.flatMap((scheme) => scheme.sectorTags))]
  const regions = [...new Set(schemes.map((scheme) => scheme.region))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Award className="h-7 w-7 text-primary" />
          Funding Schemes
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          options={{
            sector: sectors,
            region: regions,
          }}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
          ))}
        </div>
      ) : paginatedSchemes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {paginatedSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No schemes found matching your criteria.</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      )}
    </div>
  )
}
