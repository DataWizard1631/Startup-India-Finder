"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Check, Link as LinkIcon } from "lucide-react"
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
import { cn } from "@/lib/utils"

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
  const isUrgent = daysRemaining < 14

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
          id: hackathon.id,
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
    <Card className="group hover:shadow-md transition-all duration-200 border-muted/80">
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{hackathon.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 md:line-clamp-1">{hackathon.desc}</p>

            <div className="flex flex-wrap gap-1 mt-3">
              {hackathon.sectorTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
            <div className="text-sm text-right">
              <div className="flex items-center justify-end text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className={cn(isUrgent && "text-destructive font-medium")}>
                  {formattedDate}
                </span>
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
                <Button variant="outline" size="sm" className="mt-1">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">{hackathon.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-1 pt-1">
                    <Users className="h-4 w-4" />
                    {hackathon.organiser}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div>
                    <h4 className="font-medium mb-1.5">Description</h4>
                    <p className="text-sm text-muted-foreground">{hackathon.desc}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1.5">Date</h4>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formattedDate}
                        </p>
                        {daysRemaining > 0 && (
                          <p className={cn(
                            "text-sm",
                            isUrgent ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {daysRemaining} days away
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1.5">Location</h4>
                      <p className="text-sm flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {hackathon.location}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1.5">Mode</h4>
                      <p className="text-sm flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {hackathon.mode}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1.5">Organiser</h4>
                      <p className="text-sm">{hackathon.organiser}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1.5">Sectors</h4>
                    <div className="flex flex-wrap gap-1">
                      {hackathon.sectorTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {hackathon.website && (
                    <div>
                      <h4 className="font-medium mb-1.5">Website</h4>
                      <a 
                        href={hackathon.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-1 text-primary hover:underline"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Visit official website
                      </a>
                    </div>
                  )}
                </div>

                <DialogFooter className="flex sm:justify-between gap-2 mt-6">
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
