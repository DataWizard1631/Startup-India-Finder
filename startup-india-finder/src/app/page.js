"use client"

import { useState, useEffect } from "react"
import { Calendar, Award, Clock, Search, ChevronRight, MapPin, Users, ArrowRight } from "lucide-react"
import { useSearchContext } from "@/context/SearchContext"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import SchemeCard from "@/components/schemes/SchemeCard"
import HackathonCard from "@/components/hackathons/HackathonCard"

export default function Dashboard() {
  const [schemes, setSchemes] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const { searchQuery } = useSearchContext()
  const [filterQuery, setFilterQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemesRes, hackathonsRes] = await Promise.all([
          fetch("/api/schemes"), 
          fetch("/api/hackathons")
        ])

        const schemesData = await schemesRes.json()
        const hackathonsData = await hackathonsRes.json()

        setSchemes(schemesData)
        setHackathons(hackathonsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply both search query and filter query
  const filterItems = (items) => {
    // First apply global search query
    let filtered = items
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query) ||
          item.sectorTags.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    
    // Then apply local filter query
    if (filterQuery) {
      const query = filterQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.sectorTags.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    
    return filtered
  }

  const filteredSchemes = filterItems(schemes)
  const filteredHackathons = filterItems(hackathons)

  // Get top featured items
  const featuredSchemes = filteredSchemes.slice(0, 3)
  
  // Sort hackathons by date (upcoming first)
  const upcomingHackathons = [...filteredHackathons]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)
    
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative -mx-4 -mt-8 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Opportunities for Your Startup
            </h1>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl">
              Access government schemes, funds, and hackathons tailored for Indian startups
              all in one place.
            </p>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <Input
                type="text"
                placeholder="Search by sector, location, or keyword..."
                className="pl-10 bg-white/20 text-white border-0 placeholder:text-white/70 focus:bg-white/30"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="container mx-auto">
          <div className="bg-card shadow-lg rounded-lg -mt-6 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mr-4 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Government Schemes</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Access grants, loans, and incentives from central and state governments
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3 mr-4 text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Hackathons & Events</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Participate in competitions to showcase your innovation and win prizes
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-4 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Deadline Reminders</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Never miss application deadlines with personalized notifications
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Featured Schemes
          </h2>
          <Button variant="outline" size="sm" asChild className="gap-1">
            <a href="/schemes">
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[300px]">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : featuredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme) => (
              <Card key={scheme.id} className="overflow-hidden h-full border-t-4" style={{ borderTopColor: scheme.type === "central" ? "#4f46e5" : "#8b5cf6" }}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant={scheme.type === "central" ? "default" : "secondary"} className="mb-2">
                        {scheme.type === "central" ? "Central" : "State"}
                      </Badge>
                      <h3 className="font-medium text-lg">{scheme.title}</h3>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {scheme.region || "All India"}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{scheme.desc}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {scheme.sectorTags && scheme.sectorTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-destructive font-medium">
                      {scheme.deadline ? formatDate(scheme.deadline) : "Open"}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a href={`/schemes/${scheme.id}`}>
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg py-12 text-center">
            <p className="text-muted-foreground">No schemes found matching your search.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setFilterQuery("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* Upcoming Hackathons Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Upcoming Hackathons
          </h2>
          <Button variant="outline" size="sm" asChild className="gap-1">
            <a href="/hackathons">
              View Calendar
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        ) : upcomingHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="overflow-hidden h-full border border-l-4" style={{ borderLeftColor: hackathon.mode === "Hybrid" ? "#eab308" : hackathon.mode === "Online" ? "#22c55e" : "#ef4444" }}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant={hackathon.mode === "Hybrid" ? "warning" : hackathon.mode === "Online" ? "success" : "destructive"} className="mb-2">
                      {hackathon.mode}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-lg">{hackathon.title}</h3>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(hackathon.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hackathon.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {hackathon.organiser}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hackathon.sectorTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end items-center border-t mt-2">
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a href={`/hackathons/${hackathon.id}`}>
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg py-12 text-center">
            <p className="text-muted-foreground">No hackathons found matching your search.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setFilterQuery("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* Why Use This Platform Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-lg p-8 border mt-12">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-5 relative z-10">
          <Clock className="h-6 w-6 text-primary" />
          Why Startup India Finder?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-3xl relative z-10">
          Stay updated with the latest government schemes, policies, and hackathons for Indian startups
          without hopping between multiple websites. Access everything you need in one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 w-fit mb-4 text-primary">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-medium mb-2">Discover Funding</h3>
            <p className="text-sm text-muted-foreground">
              Find government schemes and grants tailored for your startup's sector and stage.
            </p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3 w-fit mb-4 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-medium mb-2">Track Hackathons</h3>
            <p className="text-sm text-muted-foreground">
              Never miss an opportunity to showcase your innovation and win recognition.
            </p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 w-fit mb-4 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-medium mb-2">Personalized Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Get timely notifications about opportunities matching your startup's profile.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
