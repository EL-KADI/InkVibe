"use client"

import { useRef } from "react"
import { BookCard } from "./book-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface BookCarouselProps {
  books: Book[]
  title: string
  onAddToFavorites?: (book: Book) => void
  onAddToReadingList?: (book: Book) => void
}

export function BookCarousel({ books, title, onAddToFavorites, onAddToReadingList }: BookCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={scrollLeft}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {books.map((book) => (
          <div key={book.key} className="flex-none w-64">
            <BookCard book={book} onAddToFavorites={onAddToFavorites} onAddToReadingList={onAddToReadingList} />
          </div>
        ))}
      </div>
    </section>
  )
}
