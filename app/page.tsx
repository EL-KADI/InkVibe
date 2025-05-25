"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BookCarousel } from "@/components/book-carousel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Clock, Heart } from "lucide-react"

interface Book {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  subject?: string[]
  language?: string[]
  edition_count?: number
}

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([])
  const [recentBooks, setRecentBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)

        try {
          const featuredResponse = await fetch("/api/search?q=classic&limit=20")
          if (featuredResponse.ok) {
            const featuredData = await featuredResponse.json()
            setFeaturedBooks(featuredData.docs || [])
          }
        } catch (error) {
          console.error("Error fetching featured books:", error)
        }

        try {
          const trendingResponse = await fetch("/api/search?q=bestseller&limit=20")
          if (trendingResponse.ok) {
            const trendingData = await trendingResponse.json()
            setTrendingBooks(trendingData.docs || [])
          }
        } catch (error) {
          console.error("Error fetching trending books:", error)
        }

        try {
          const recentResponse = await fetch("/api/search?q=fiction&sort=new&limit=20")
          if (recentResponse.ok) {
            const recentData = await recentResponse.json()
            setRecentBooks(recentData.docs || [])
          }
        } catch (error) {
          console.error("Error fetching recent books:", error)
        }
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleAddToFavorites = (book: Book) => {
    console.log("Added to favorites:", book.title)
  }

  const handleAddToReadingList = (book: Book) => {
    console.log("Added to reading list:", book.title)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">InkVibe</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover thousands of free books from the Open Library. Build your reading lists, track your progress, and
            explore new worlds.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for books, authors, or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              Search
            </Button>
          </form>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-card rounded-lg border">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold">1M+</h3>
            <p className="text-muted-foreground">Books Available</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold">24/7</h3>
            <p className="text-muted-foreground">Access Anytime</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold">Free</h3>
            <p className="text-muted-foreground">Always & Forever</p>
          </div>
        </section>

        {featuredBooks.length > 0 && (
          <BookCarousel
            books={featuredBooks}
            title="Featured Classics"
            onAddToFavorites={handleAddToFavorites}
            onAddToReadingList={handleAddToReadingList}
          />
        )}

        {trendingBooks.length > 0 && (
          <BookCarousel
            books={trendingBooks}
            title="Trending Now"
            onAddToFavorites={handleAddToFavorites}
            onAddToReadingList={handleAddToReadingList}
          />
        )}

        {recentBooks.length > 0 && (
          <BookCarousel
            books={recentBooks}
            title="Recently Added"
            onAddToFavorites={handleAddToFavorites}
            onAddToReadingList={handleAddToReadingList}
          />
        )}

        {featuredBooks.length === 0 && trendingBooks.length === 0 && recentBooks.length === 0 && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Welcome to InkVibe!</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring our vast collection of free books by searching for your favorite titles, authors, or
                genres.
              </p>
              <Button onClick={() => (window.location.href = "/browse")}>Browse Books</Button>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Powered by{" "}
            <a href="https://openlibrary.org" className="text-primary hover:underline">
              Open Library API
            </a>
          </p>
          <p className="text-sm text-muted-foreground mt-2">© 2025 InkVibe. for book lovers everywhere.</p>
        </div>
      </footer>
    </div>
  )
}
