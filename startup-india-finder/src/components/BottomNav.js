"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Award, Users, User } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path
  }

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
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
