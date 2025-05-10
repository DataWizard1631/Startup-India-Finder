"use client"

import Link from "next/link"
import { Search, Menu, X, Bell, Moon, Sun, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchContext } from "@/context/SearchContext"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const { searchQuery, setSearchQuery } = useSearchContext()
  const { theme, setTheme } = useTheme()
  const [reminders, setReminders] = useLocalStorage("reminders", [])
  const [inputValue, setInputValue] = useState(searchQuery)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isReminderOpen, setIsReminderOpen] = useState(false)

  // Sort reminders by date (closest first)
  const sortedReminders = [...reminders].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, setSearchQuery])

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-4">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                Startup India
              </span>
              <span className="font-semibold ml-1">Finder</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/schemes"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Schemes
              </Link>
              <Link
                href="/hackathons"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Hackathons
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search schemes, hackathons, and more..."
                className="pl-10 w-full max-w-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            {/* Theme Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 relative" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Reminders Button */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9"
                onClick={() => setIsReminderOpen(!isReminderOpen)}
              >
                <Bell className="h-4 w-4" />
                {reminders.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
                <span className="sr-only">Reminders</span>
              </Button>
              
              {/* Reminders Dialog (Simple Implementation) */}
              {isReminderOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background rounded-lg border shadow-lg z-50 p-4 max-h-[70vh] overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Your Reminders</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      onClick={() => setIsReminderOpen(false)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {sortedReminders.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6">
                        No reminders set. Add reminders from scheme or hackathon details.
                      </p>
                    ) : (
                      sortedReminders.map((reminder) => {
                        const date = new Date(reminder.date);
                        const formattedDate = date.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });
                        const daysRemaining = Math.ceil(
                          (date - new Date()) / (1000 * 60 * 60 * 24)
                        );
                        
                        return (
                          <div
                            key={reminder.id}
                            className="border rounded-lg p-3 space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{reminder.title}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setReminders(
                                    reminders.filter((r) => r.id !== reminder.id)
                                  );
                                }}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove reminder</span>
                              </Button>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {formattedDate}
                                {daysRemaining > 0 && (
                                  <span
                                    className={`ml-2 ${
                                      daysRemaining < 14
                                        ? "text-destructive"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    ({daysRemaining} days remaining)
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {reminder.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Link */}
            <Link href="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border"
              >
                <span className="font-medium text-xs">SI</span>
                <span className="sr-only">Profile</span>
              </Button>
            </Link>

            {/* Mobile Menu Trigger */}
            <div className="relative md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              
              {/* Mobile Menu Overlay */}
              {isMobileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  
                  {/* Menu Panel */}
                  <div className="fixed inset-y-0 right-0 w-[280px] bg-background border-l shadow-lg z-50 flex flex-col p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                          Startup India
                        </span>
                        <span className="font-semibold ml-1">Finder</span>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>

                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 w-full"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>

                    <nav className="flex flex-col space-y-4">
                      <Link
                        href="/"
                        className="text-base font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        href="/schemes"
                        className="text-base font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Schemes
                      </Link>
                      <Link
                        href="/hackathons"
                        className="text-base font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Hackathons
                      </Link>
                      <Link
                        href="/profile"
                        className="text-base font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </nav>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
