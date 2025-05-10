"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Award, Users, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Schemes",
      href: "/schemes",
      icon: Award,
    },
    {
      name: "Hackathons",
      href: "/hackathons",
      icon: Users,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <item.icon className={cn(
                "h-5 w-5 mb-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs transition-colors",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
