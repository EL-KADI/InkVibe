"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

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

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const genres = [
    "Fiction",
    "Non-fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
    "Thriller",
    "Biography",
    "History",
    "Science",
    "Philosophy",
  ]

  useEffect(() => {
    if (searchQuery) {
      searchBooks()
    }
  }, [searchQuery, sortBy, selectedGenres, currentPage])

  const searchBooks = async () => {
    setLoading(true)
    try {
      let query = searchQuery
      if (selectedGenres.length > 0) {
        query += ` subject:(${selectedGenres.join(" OR ")})`
      }

      const offset = (currentPage - 1) * 20
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&limit=20&offset=${offset}&sort=${sortBy}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch books")
      }

      const data = await response.json()

      setBooks(data.docs || [])
      setTotalResults(data.numFound || 0)
    } catch (error) {
      console.error("Error searching books:", error)
      setBooks([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    searchBooks()
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSortBy("relevance")
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalResults / 20)

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for books, authors, or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="new">Newest</SelectItem>
                <SelectItem value="old">Oldest</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>

            {(selectedGenres.length > 0 || sortBy !== "relevance") && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Search Results for "{searchQuery}"</h1>
            <p className="text-muted-foreground">{totalResults.toLocaleString()} books found</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {books.map((book) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>

            {books.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No books found for your search. Try different keywords or filters.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
