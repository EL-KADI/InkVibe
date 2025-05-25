"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, BookOpen, Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

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

interface ReadingList {
  id: string
  name: string
  description: string
  books: Book[]
  createdAt: string
}

interface BookCardProps {
  book: Book
  onAddToFavorites?: (book: Book) => void
  onAddToReadingList?: (book: Book) => void
}

export function BookCard({ book, onAddToFavorites, onAddToReadingList }: BookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [readingLists, setReadingLists] = useState<ReadingList[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [newListName, setNewListName] = useState("")

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.some((fav: Book) => fav.key === book.key))

    const savedLists = JSON.parse(localStorage.getItem("readingLists") || "[]")
    setReadingLists(savedLists)
  }, [book.key])

  const handleFavoriteToggle = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    let updatedFavorites

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav: Book) => fav.key !== book.key)
    } else {
      updatedFavorites = [...favorites, book]
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    setIsFavorite(!isFavorite)
    onAddToFavorites?.(book)
  }

  const handleReadBook = () => {
    window.open(`https://openlibrary.org${book.key}`, "_blank")
  }

  const addToList = (listId: string) => {
    const savedLists = JSON.parse(localStorage.getItem("readingLists") || "[]")
    const updatedLists = savedLists.map((list: ReadingList) => {
      if (list.id === listId) {
        const bookExists = list.books.some((b: Book) => b.key === book.key)
        if (!bookExists) {
          return {
            ...list,
            books: [...list.books, book],
          }
        }
      }
      return list
    })

    localStorage.setItem("readingLists", JSON.stringify(updatedLists))
    setReadingLists(updatedLists)
    setShowDialog(false)
    onAddToReadingList?.(book)
  }

  const createNewList = () => {
    if (!newListName.trim()) return

    const newList: ReadingList = {
      id: Date.now().toString(),
      name: newListName,
      description: "",
      books: [book],
      createdAt: new Date().toISOString(),
    }

    const savedLists = JSON.parse(localStorage.getItem("readingLists") || "[]")
    const updatedLists = [...savedLists, newList]

    localStorage.setItem("readingLists", JSON.stringify(updatedLists))
    setReadingLists(updatedLists)
    setNewListName("")
    setShowDialog(false)
    onAddToReadingList?.(book)
  }

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "/placeholder.svg?height=200&width=150"

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
            <Image
              src={imageError ? "/placeholder.svg?height=200&width=150" : coverUrl}
              alt={book.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 ${isFavorite ? "text-red-500" : "text-gray-400"}`}
            onClick={handleFavoriteToggle}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{book.title}</h3>

          {book.author_name && <p className="text-xs text-muted-foreground line-clamp-1">by {book.author_name[0]}</p>}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {book.first_publish_year && <span>{book.first_publish_year}</span>}
            {book.edition_count && <span>{book.edition_count} editions</span>}
          </div>

          {book.subject && book.subject.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.subject.slice(0, 2).map((subject, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <BookOpen className="h-3 w-3 mr-1" />
                Add to List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Reading List</DialogTitle>
                <DialogDescription>Choose a reading list or create a new one for "{book.title}"</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {readingLists.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Existing Lists:</h4>
                    <div className="space-y-2">
                      {readingLists.map((list) => (
                        <Button
                          key={list.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => addToList(list.id)}
                        >
                          {list.name} ({list.books.length} books)
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Create New List:</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter list name..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && createNewList()}
                    />
                    <Button onClick={createNewList} disabled={!newListName.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="default" size="sm" className="flex-1" onClick={handleReadBook}>
            <Star className="h-3 w-3 mr-1" />
            Read
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
