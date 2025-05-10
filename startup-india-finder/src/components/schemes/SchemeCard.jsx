"use client"

import { useState } from "react"
import { Calendar, MapPin, Check, Clock, Users } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function SchemeCard({ scheme }) {
  const [reminders, setReminders] = useLocalStorage("reminders", [])
  const [isReminderSet, setIsReminderSet] = useState(() => {
    return reminders.some((reminder) => reminder.type === "scheme" && reminder.id === scheme.id)
  })

  // Format deadline
  const deadline = new Date(scheme.deadline)
  const formattedDeadline = deadline.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  // Calculate days remaining
  const today = new Date()
  const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
  const isUrgent = daysRemaining < 30

  // Toggle reminder
  const toggleReminder = () => {
    if (isReminderSet) {
      // Remove reminder
      setReminders(reminders.filter((reminder) => !(reminder.type === "scheme" && reminder.id === scheme.id)))
      setIsReminderSet(false)
    } else {
      // Add reminder
      setReminders([
        ...reminders,
        {
          id: scheme.id,
          type: "scheme",
          title: scheme.title,
          date: scheme.deadline,
          tags: scheme.sectorTags,
        },
      ])
      setIsReminderSet(true)
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 border-muted/80">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold leading-tight">{scheme.title}</CardTitle>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          {scheme.region}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{scheme.desc}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {scheme.sectorTags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className={cn(isUrgent && "text-destructive font-medium")}>
            {formattedDeadline}
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">{scheme.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-1 pt-1">
                <MapPin className="h-4 w-4" />
                {scheme.region}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              <div>
                <h4 className="font-medium mb-1.5">Description</h4>
                <p className="text-sm text-muted-foreground">{scheme.desc}</p>
              </div>

              <div>
                <h4 className="font-medium mb-1.5">Eligibility</h4>
                <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1.5">Deadline</h4>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formattedDeadline}
                  </p>
                  {daysRemaining > 0 && (
                    <p className={cn(
                      "text-sm mt-1",
                      isUrgent ? "text-destructive" : "text-muted-foreground"
                    )}>
                      <Clock className="h-3.5 w-3.5 inline mr-1" />
                      {daysRemaining} days remaining
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-1.5">Sectors</h4>
                  <div className="flex flex-wrap gap-1">
                    {scheme.sectorTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
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
      </CardFooter>
    </Card>
  )
}
