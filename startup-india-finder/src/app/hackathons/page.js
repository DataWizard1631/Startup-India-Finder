"use client"

import { useState, useEffect } from "react"
import { Calendar, List, Users, Filter } from "lucide-react"
import HackathonCard from "@/components/HackathonCard"
import CalendarView from "@/components/CalendarView"
import FilterBar from "@/components/FilterBar"
import { useSearchContext } from "@/context/SearchContext"
import { useFilters } from "@/hooks/useFilters"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState("list")
  const { searchQuery } = useSearchContext()
  const { filters, updateFilter, resetFilters } = useFilters({
    date: null,
    mode: [],
    sector: [],
    location: [],
    organiser: [],
  })

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch("/api/hackathons")
        const data = await res.json()
        setHackathons(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching hackathons:", error)
        setLoading(false)
      }
    }

    fetchHackathons()
  }, [])

  // Filter hackathons based on search query and filters
  const filteredHackathons = hackathons.filter((hackathon) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.sectorTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Date filter
    const matchesDate =
      !filters.date || new Date(hackathon.date).toDateString() === new Date(filters.date).toDateString()

    // Mode filter
    const matchesMode = filters.mode.length === 0 || filters.mode.includes(hackathon.mode)

    // Sector filter
    const matchesSector =
      filters.sector.length === 0 || hackathon.sectorTags.some((tag) => filters.sector.includes(tag))

    // Location filter
    const matchesLocation = filters.location.length === 0 || filters.location.includes(hackathon.location)

    // Organiser filter (assuming organiser is part of the hackathon data)
    const matchesOrganiser =
      filters.organiser.length === 0 || (hackathon.organiser && filters.organiser.includes(hackathon.organiser))

    return matchesSearch && matchesDate && matchesMode && matchesSector && matchesLocation && matchesOrganiser
  })

  // Sort hackathons by date (upcoming first)
  const sortedHackathons = [...filteredHackathons].sort((a, b) => new Date(a.date) - new Date(b.date))

  // Get unique values for filters
  const modes = [...new Set(hackathons.map((h) => h.mode))]
  const sectors = [...new Set(hackathons.flatMap((h) => h.sectorTags))]
  const locations = [...new Set(hackathons.map((h) => h.location))]
  const organisers = hackathons.map((h) => h.organiser).filter(Boolean)
  const uniqueOrganisers = [...new Set(organisers)]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          Hackathons
        </h1>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="list" className="w-[200px]" onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
      </div>

      {showFilters && (
        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          options={{
            mode: modes,
            sector: sectors,
            location: locations,
            organiser: uniqueOrganisers,
          }}
          showDateFilter={true}
        />
      )}

      {loading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))}
        </div>
      ) : sortedHackathons.length > 0 ? (
        <div className="mt-6">
          {view === "list" ? (
            <div className="space-y-4">
              {sortedHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          ) : (
            <CalendarView hackathons={sortedHackathons} />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No hackathons found matching your criteria.</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      )}
    </div>
  )
}
