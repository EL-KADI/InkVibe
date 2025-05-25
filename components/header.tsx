"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">InkVibe</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/browse" className="text-sm font-medium hover:text-primary transition-colors">
            Browse
          </Link>
          <Link href="/reading-lists" className="text-sm font-medium hover:text-primary transition-colors">
            Reading Lists
          </Link>
          <Link href="/kids" className="text-sm font-medium hover:text-primary transition-colors">
            Kids
          </Link>
          <Link href="/stats" className="text-sm font-medium hover:text-primary transition-colors">
            Stats
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/browse" className="text-sm font-medium hover:text-primary transition-colors">
                  Browse
                </Link>
                <Link href="/reading-lists" className="text-sm font-medium hover:text-primary transition-colors">
                  Reading Lists
                </Link>
                <Link href="/kids" className="text-sm font-medium hover:text-primary transition-colors">
                  Kids
                </Link>
                <Link href="/stats" className="text-sm font-medium hover:text-primary transition-colors">
                  Stats
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
