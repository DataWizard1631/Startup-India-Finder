"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Check } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function HackathonCard({ hackathon }) {
  const [reminders, setReminders] = useLocalStorage("reminders", [])
  const [isReminderSet, setIsReminderSet] = useState(() => {
    return reminders.some((reminder) => reminder.type === "hackathon" && reminder.id === hackathon.id)
  })

  // Format date
  const date = new Date(hackathon.date)
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  // Calculate days remaining
  const today = new Date()
  const daysRemaining = Math.ceil((date - today) / (1000 * 60 * 60 * 24))

  // Toggle reminder
  const toggleReminder = () => {
    if (isReminderSet) {
      // Remove reminder
      setReminders(reminders.filter((reminder) => !(reminder.type === "hackathon" && reminder.id === hackathon.id)))
      setIsReminderSet(false)
    } else {
      // Add reminder
      setReminders([
        ...reminders,
        {
          id: `hackathon-${hackathon.id}`,
          type: "hackathon",
          title: hackathon.title,
          date: hackathon.date,
          tags: hackathon.sectorTags,
        },
      ])
      setIsReminderSet(true)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{hackathon.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{hackathon.desc}</p>

            <div className="flex flex-wrap gap-1 mt-3">
              {hackathon.sectorTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 ml-4">
            <div className="text-sm text-right">
              <div className="flex items-center justify-end text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className={daysRemaining < 14 ? "text-destructive font-medium" : ""}>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-end text-muted-foreground mb-1">
                <MapPin className="h-4 w-4 mr-1" />
                {hackathon.location}
              </div>
              <div className="flex items-center justify-end text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {hackathon.mode}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{hackathon.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-1 pt-1">
                    <Users className="h-4 w-4" />
                    {hackathon.organiser}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{hackathon.desc}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Date</h4>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formattedDate}
                        {daysRemaining > 0 && (
                          <span className={`ml-2 ${daysRemaining < 14 ? "text-destructive" : "text-muted-foreground"}`}>
                            ({daysRemaining} days away)
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Location</h4>
                      <p className="text-sm flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {hackathon.location}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Mode</h4>
                      <p className="text-sm flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {hackathon.mode}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Organiser</h4>
                      <p className="text-sm">{hackathon.organiser}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Sectors</h4>
                    <div className="flex flex-wrap gap-1">
                      {hackathon.sectorTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex sm:justify-between gap-2">
                  <Button
                    variant={isReminderSet ? "outline" : "default"}
                    className={isReminderSet ? "gap-1" : ""}
                    onClick={toggleReminder}
                  >
                    {isReminderSet && <Check className="h-4 w-4" />}
                    {isReminderSet ? "Reminder Set" : "Set Reminder"}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
