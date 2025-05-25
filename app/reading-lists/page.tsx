"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen, Heart, Clock, Star, ArrowLeft } from "lucide-react"

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

export default function ReadingListsPage() {
  const [readingLists, setReadingLists] = useState<ReadingList[]>([])
  const [favorites, setFavorites] = useState<Book[]>([])
  const [newListName, setNewListName] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedList, setSelectedList] = useState<ReadingList | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const savedLists = JSON.parse(localStorage.getItem("readingLists") || "[]")
    setReadingLists(savedLists)

    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setFavorites(savedFavorites)
  }

  const createNewList = () => {
    if (!newListName.trim()) return

    const newList: ReadingList = {
      id: Date.now().toString(),
      name: newListName,
      description: "",
      books: [],
      createdAt: new Date().toISOString(),
    }

    const updatedLists = [...readingLists, newList]
    setReadingLists(updatedLists)
    localStorage.setItem("readingLists", JSON.stringify(updatedLists))

    setNewListName("")
    setShowCreateForm(false)
  }

  const deleteList = (listId: string) => {
    const updatedLists = readingLists.filter((list) => list.id !== listId)
    setReadingLists(updatedLists)
    localStorage.setItem("readingLists", JSON.stringify(updatedLists))
  }

  const removeFromFavorites = (bookKey: string) => {
    const updatedFavorites = favorites.filter((book) => book.key !== bookKey)
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  const removeBookFromList = (listId: string, bookKey: string) => {
    const updatedLists = readingLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          books: list.books.filter((book) => book.key !== bookKey),
        }
      }
      return list
    })

    setReadingLists(updatedLists)
    localStorage.setItem("readingLists", JSON.stringify(updatedLists))

    if (selectedList && selectedList.id === listId) {
      const updatedSelectedList = updatedLists.find((list) => list.id === listId)
      setSelectedList(updatedSelectedList || null)
    }
  }

  const viewList = (list: ReadingList) => {
    loadData()
    const currentList = readingLists.find((l) => l.id === list.id) || list
    setSelectedList(currentList)
  }

  if (selectedList) {
    return (
      <div className="min-h-screen">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setSelectedList(null)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reading Lists
            </Button>

            <h1 className="text-3xl font-bold mb-2">{selectedList.name}</h1>
            <p className="text-muted-foreground">{selectedList.books.length} books in this list</p>
          </div>

          {selectedList.books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {selectedList.books.map((book) => (
                <div key={book.key} className="relative">
                  <BookCard book={book} />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 left-2 z-10"
                    onClick={() => removeBookFromList(selectedList.id, book.key)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Books in This List</h3>
              <p className="text-muted-foreground mb-4">Start adding books to see them here.</p>
              <Button onClick={() => setSelectedList(null)}>Browse Books</Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">My Reading Lists</h1>
          <p className="text-muted-foreground">
            Organize your books into custom reading lists and track your favorites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{readingLists.length}</div>
              <div className="text-sm text-muted-foreground">Reading Lists</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {readingLists.reduce((total, list) => total + list.books.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Books</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Books Read</div>
            </CardContent>
          </Card>
        </div>

        {favorites.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                My Favorites
              </h2>
              <Badge variant="secondary">{favorites.length} books</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {favorites.slice(0, 10).map((book) => (
                <BookCard key={book.key} book={book} onAddToFavorites={() => removeFromFavorites(book.key)} />
              ))}
            </div>

            {favorites.length > 10 && (
              <div className="text-center mt-6">
                <Button variant="outline">View All Favorites</Button>
              </div>
            )}
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Custom Reading Lists</h2>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New List
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Reading List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter list name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && createNewList()}
                  />
                  <Button onClick={createNewList}>Create</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {readingLists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readingLists.map((list) => (
                <Card key={list.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{list.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{list.books.length} books</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteList(list.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {list.books.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {list.books.slice(0, 3).map((book) => (
                          <div key={book.key} className="aspect-[3/4] relative">
                            <img
                              src={
                                book.cover_i
                                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
                                  : "/placeholder.svg?height=120&width=90"
                              }
                              alt={book.title}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No books added yet</p>
                      </div>
                    )}

                    <Button variant="outline" className="w-full mt-4" onClick={() => viewList(list)}>
                      View List
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Reading Lists Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first reading list to organize your favorite books.
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First List
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
