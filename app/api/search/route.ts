import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const limit = searchParams.get("limit") || "20"
  const offset = searchParams.get("offset") || "0"
  const sort = searchParams.get("sort") || "relevance"

  try {
    const apiUrl = new URL("https://openlibrary.org/search.json")
    apiUrl.searchParams.set("q", query)
    apiUrl.searchParams.set("limit", limit)
    apiUrl.searchParams.set("offset", offset)

    if (sort !== "relevance") {
      apiUrl.searchParams.set("sort", sort)
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {
        "User-Agent": "InkVibe/1.0 (Digital Library App)",
      },
    })

    if (!response.ok) {
      throw new Error(`Open Library API error: ${response.status}`)
    }

    const data = await response.json()

    const booksWithCovers =
      data.docs?.map((book: any) => ({
        ...book,
        cover_i: book.cover_i || Math.floor(Math.random() * 10000000) + 1000000,
      })) || []

    return NextResponse.json({
      ...data,
      docs: booksWithCovers,
    })
  } catch (error) {
    console.error("Error fetching from Open Library:", error)
    return NextResponse.json({ error: "Failed to fetch books", docs: [], numFound: 0 }, { status: 500 })
  }
}
