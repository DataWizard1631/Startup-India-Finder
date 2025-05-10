"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FilterBar({ filters, updateFilter, resetFilters, options, showDateFilter = false }) {
  const [expanded, setExpanded] = useState(["sector"])

  // Handle checkbox change
  const handleCheckboxChange = (type, value) => {
    const currentValues = filters[type] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    updateFilter(type, newValues)
  }

  // Handle date change
  const handleDateChange = (e) => {
    updateFilter("date", e.target.value)
  }

  // Count active filters
  const countActiveFilters = () => {
    let count = 0
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) count += value.length
      else if (value && !Array.isArray(value)) count += 1
    })
    return count
  }

  return (
    <div className="bg-muted p-4 rounded-lg mb-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Filters</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{countActiveFilters()} active</Badge>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
            Clear All
          </Button>
        </div>
      </div>

      <Accordion type="multiple" value={expanded} onValueChange={setExpanded} className="space-y-2">
        {/* Date Filter */}
        {showDateFilter && (
          <AccordionItem value="date" className="border rounded-md px-3">
            <AccordionTrigger className="py-2">Date</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                <Label htmlFor="date-filter" className="text-sm mb-2 block">
                  Select Date
                </Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={filters.date || ""}
                  onChange={handleDateChange}
                  className="w-full"
                />
                {filters.date && (
                  <div className="mt-2 flex">
                    <Badge className="gap-1 mt-2">
                      {new Date(filters.date).toLocaleDateString()}
                      <button
                        onClick={() => updateFilter("date", null)}
                        className="ml-1 rounded-full hover:bg-primary/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Sector Filter */}
        {options.sector && (
          <AccordionItem value="sector" className="border rounded-md px-3">
            <AccordionTrigger className="py-2">Sectors</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
                {options.sector.map((sector) => (
                  <div key={sector} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sector-${sector}`}
                      checked={filters.sector?.includes(sector)}
                      onCheckedChange={() => handleCheckboxChange("sector", sector)}
                    />
                    <Label htmlFor={`sector-${sector}`} className="text-sm cursor-pointer">
                      {sector}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.sector?.length > 0 && (
                <div className="flex flex-wrap gap-1 pb-2">
                  {filters.sector.map((sector) => (
                    <Badge key={sector} variant="secondary" className="gap-1">
                      {sector}
                      <button
                        onClick={() => handleCheckboxChange("sector", sector)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Region/Location Filter */}
        {(options.region || options.location) && (
          <AccordionItem value="location" className="border rounded-md px-3">
            <AccordionTrigger className="py-2">{options.region ? "Regions" : "Locations"}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
                {(options.region || options.location).map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters[options.region ? "region" : "location"]?.includes(location)}
                      onCheckedChange={() => handleCheckboxChange(options.region ? "region" : "location", location)}
                    />
                    <Label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
              {filters[options.region ? "region" : "location"]?.length > 0 && (
                <div className="flex flex-wrap gap-1 pb-2">
                  {filters[options.region ? "region" : "location"].map((location) => (
                    <Badge key={location} variant="secondary" className="gap-1">
                      {location}
                      <button
                        onClick={() => handleCheckboxChange(options.region ? "region" : "location", location)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Mode Filter */}
        {options.mode && (
          <AccordionItem value="mode" className="border rounded-md px-3">
            <AccordionTrigger className="py-2">Mode</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
                {options.mode.map((mode) => (
                  <div key={mode} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mode-${mode}`}
                      checked={filters.mode?.includes(mode)}
                      onCheckedChange={() => handleCheckboxChange("mode", mode)}
                    />
                    <Label htmlFor={`mode-${mode}`} className="text-sm cursor-pointer">
                      {mode}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.mode?.length > 0 && (
                <div className="flex flex-wrap gap-1 pb-2">
                  {filters.mode.map((mode) => (
                    <Badge key={mode} variant="secondary" className="gap-1">
                      {mode}
                      <button
                        onClick={() => handleCheckboxChange("mode", mode)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Organiser Filter */}
        {options.organiser && (
          <AccordionItem value="organiser" className="border rounded-md px-3">
            <AccordionTrigger className="py-2">Organiser</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
                {options.organiser.map((organiser) => (
                  <div key={organiser} className="flex items-center space-x-2">
                    <Checkbox
                      id={`organiser-${organiser}`}
                      checked={filters.organiser?.includes(organiser)}
                      onCheckedChange={() => handleCheckboxChange("organiser", organiser)}
                    />
                    <Label htmlFor={`organiser-${organiser}`} className="text-sm cursor-pointer">
                      {organiser}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.organiser?.length > 0 && (
                <div className="flex flex-wrap gap-1 pb-2">
                  {filters.organiser.map((organiser) => (
                    <Badge key={organiser} variant="secondary" className="gap-1">
                      {organiser}
                      <button
                        onClick={() => handleCheckboxChange("organiser", organiser)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
