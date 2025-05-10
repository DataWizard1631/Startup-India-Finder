import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import BottomNav from "@/components/layout/BottomNav"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { SearchProvider } from "@/context/SearchContext"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "Startup India Finder",
  description: "Discover government funding schemes, policies, and hackathons for Indian startups",
  manifest: "/manifest.json",
  generator: 'Startup India Finder'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} flex flex-col min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SearchProvider>
            <Suspense fallback={<div className="h-16 border-b"></div>}>
              <Header />
            </Suspense>
            <main className="flex-1 container mx-auto px-4 py-8 mb-16 md:mb-0">
              {children}
            </main>
            <Suspense fallback={null}>
              <div className="md:hidden">
                <BottomNav />
              </div>
              <div className="hidden md:block">
                <Footer />
              </div>
            </Suspense>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
