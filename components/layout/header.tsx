"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { UserNav } from "@/components/user-nav"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export default function Header() {
  const { user, isLoading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">PlayRental</span>
          </Link>
          <nav className="ml-10 hidden space-x-6 md:flex">
            <Link href="/playgrounds" className="text-sm font-medium transition-colors hover:text-primary">
              Playgrounds
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!isLoading && (
            <>
              {user ? (
                <UserNav user={user} />
              ) : (
                <div className="hidden space-x-2 md:flex">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </>
          )}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="animate-in md:hidden">
          <div className="container mx-auto space-y-4 px-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/playgrounds"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Playgrounds
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            {!isLoading && !user && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
