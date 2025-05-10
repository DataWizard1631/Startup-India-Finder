"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import HackathonCard from "@/components/HackathonCard"

export default function CalendarView({ hackathons }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)

  // Get month and year
  const month = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  // Generate calendar days
  useEffect(() => {
    const days = []
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Add empty days for the days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: null, date: null })
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      days.push({ day: i, date })
    }

    setCalendarDays(days)
  }, [currentDate])

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Navigate to current month
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get hackathons for a specific date
  const getHackathonsForDate = (date) => {
    if (!date) return []

    return hackathons.filter((hackathon) => {
      const hackathonDate = new Date(hackathon.date)
      return (
        hackathonDate.getDate() === date.getDate() &&
        hackathonDate.getMonth() === date.getMonth() &&
        hackathonDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Check if a date has hackathons
  const hasHackathons = (date) => {
    return getHackathonsForDate(date).length > 0
  }

  // Handle day click
  const handleDayClick = (date) => {
    if (!date) return
    setSelectedDay(date)
  }

  // Check if a date is today
  const isToday = (date) => {
    if (!date) return false

    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {month} {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Days of the week */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              min-h-[80px] border rounded-md p-1
              ${!day.day ? "bg-muted/50" : "hover:bg-muted cursor-pointer"}
              ${isToday(day.date) ? "border-primary" : ""}
            `}
            onClick={() => handleDayClick(day.date)}
          >
            {day.day && (
              <>
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${isToday(day.date) ? "text-primary" : ""}`}>{day.day}</span>
                  {hasHackathons(day.date) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Badge className="text-xs cursor-pointer">{getHackathonsForDate(day.date).length}</Badge>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>
                            Hackathons on{" "}
                            {day.date.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
                          {getHackathonsForDate(day.date).map((hackathon) => (
                            <HackathonCard key={hackathon.id} hackathon={hackathon} />
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* Show hackathon titles (limited) */}
                <div className="mt-1">
                  {getHackathonsForDate(day.date)
                    .slice(0, 2)
                    .map((hackathon) => (
                      <div key={hackathon.id} className="text-xs truncate text-muted-foreground">
                        {hackathon.title}
                      </div>
                    ))}
                  {getHackathonsForDate(day.date).length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{getHackathonsForDate(day.date).length - 2} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Selected day hackathons */}
      {selectedDay && getHackathonsForDate(selectedDay).length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-4">
            Hackathons on{" "}
            {selectedDay.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <div className="space-y-4">
            {getHackathonsForDate(selectedDay).map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
