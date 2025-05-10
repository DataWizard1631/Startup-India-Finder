"use client"

import { useState } from "react"
import { User, Bell, Tag, MapPin, Rocket } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Sample data for sectors, states, and startup stages
const SECTORS = [
  "Fintech",
  "Healthtech",
  "Edtech",
  "Agritech",
  "E-commerce",
  "SaaS",
  "AI/ML",
  "IoT",
  "Clean Energy",
  "Blockchain",
]

const STATES = [
  "All India",
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
  "Uttar Pradesh",
  "Rajasthan",
  "Kerala",
]

const STAGES = ["Ideation", "Validation", "Early Traction", "Scaling", "Growth"]

export default function ProfilePage() {
  // User preferences
  const [interests, setInterests] = useLocalStorage("user-interests", {
    sectors: [],
    states: [],
    stages: [],
  })

  // Notification settings
  const [notifications, setNotifications] = useLocalStorage("notification-settings", {
    inApp: true,
    email: false,
    sms: false,
  })

  // Reminders
  const [reminders, setReminders] = useLocalStorage("reminders", [])

  // New interest input
  const [newSector, setNewSector] = useState("")
  const [newState, setNewState] = useState("")
  const [newStage, setNewStage] = useState("")

  // Add interest
  const addInterest = (type, value) => {
    if (!value || interests[type].includes(value)) return

    setInterests({
      ...interests,
      [type]: [...interests[type], value],
    })

    // Reset input
    if (type === "sectors") setNewSector("")
    if (type === "states") setNewState("")
    if (type === "stages") setNewStage("")
  }

  // Remove interest
  const removeInterest = (type, value) => {
    setInterests({
      ...interests,
      [type]: interests[type].filter((item) => item !== value),
    })
  }

  // Toggle notification setting
  const toggleNotification = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    })
  }

  // Remove reminder
  const removeReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <User className="h-7 w-7 text-primary" />
        My Profile
      </h1>

      <Tabs defaultValue="interests">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="interests" className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            Interests
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            My Reminders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interests">
          <Card>
            <CardHeader>
              <CardTitle>My Interests</CardTitle>
              <CardDescription>Customize your interests to get personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sectors */}
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <Rocket className="h-5 w-5 text-primary" />
                  Sectors
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.sectors.map((sector) => (
                    <Badge key={sector} variant="secondary" className="flex items-center gap-1">
                      {sector}
                      <button
                        onClick={() => removeInterest("sectors", sector)}
                        className="ml-1 rounded-full hover:bg-muted p-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {interests.sectors.length === 0 && (
                    <p className="text-sm text-muted-foreground">No sectors selected</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    placeholder="Add a sector"
                    list="sectors-list"
                  />
                  <datalist id="sectors-list">
                    {SECTORS.map((sector) => (
                      <option key={sector} value={sector} />
                    ))}
                  </datalist>
                  <Button onClick={() => addInterest("sectors", newSector)}>Add</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  States
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.states.map((state) => (
                    <Badge key={state} variant="secondary" className="flex items-center gap-1">
                      {state}
                      <button
                        onClick={() => removeInterest("states", state)}
                        className="ml-1 rounded-full hover:bg-muted p-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {interests.states.length === 0 && <p className="text-sm text-muted-foreground">No states selected</p>}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="Add a state"
                    list="states-list"
                  />
                  <datalist id="states-list">
                    {STATES.map((state) => (
                      <option key={state} value={state} />
                    ))}
                  </datalist>
                  <Button onClick={() => addInterest("states", newState)}>Add</Button>
                </div>
              </div>

              {/* Startup Stages */}
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <Rocket className="h-5 w-5 text-primary" />
                  Startup Stage
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.stages.map((stage) => (
                    <Badge key={stage} variant="secondary" className="flex items-center gap-1">
                      {stage}
                      <button
                        onClick={() => removeInterest("stages", stage)}
                        className="ml-1 rounded-full hover:bg-muted p-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {interests.stages.length === 0 && <p className="text-sm text-muted-foreground">No stages selected</p>}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    placeholder="Add a stage"
                    list="stages-list"
                  />
                  <datalist id="stages-list">
                    {STAGES.map((stage) => (
                      <option key={stage} value={stage} />
                    ))}
                  </datalist>
                  <Button onClick={() => addInterest("stages", newStage)}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications about new opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="in-app" className="text-base">
                      In-App Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                  </div>
                  <Switch
                    id="in-app"
                    checked={notifications.inApp}
                    onCheckedChange={() => toggleNotification("inApp")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email" className="text-base">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive email updates about new opportunities</p>
                  </div>
                  <Switch
                    id="email"
                    checked={notifications.email}
                    onCheckedChange={() => toggleNotification("email")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms" className="text-base">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive SMS alerts for urgent deadlines</p>
                  </div>
                  <Switch id="sms" checked={notifications.sms} onCheckedChange={() => toggleNotification("sms")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>My Reminders</CardTitle>
              <CardDescription>Manage your saved reminders for schemes and hackathons</CardDescription>
            </CardHeader>
            <CardContent>
              {reminders.length > 0 ? (
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{reminder.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {reminder.type === "scheme" ? "Deadline" : "Date"}:{" "}
                          {new Date(reminder.date).toLocaleDateString()}
                        </p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {reminder.type === "scheme" ? "Scheme" : "Hackathon"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReminder(reminder.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">You don't have any reminders yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add reminders from schemes and hackathons to get notified before deadlines.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
