"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Target, TrendingUp, Calendar, Star } from "lucide-react"

export default function StatsPage() {
  const [readingStats, setReadingStats] = useState({
    booksRead: 12,
    pagesRead: 3420,
    readingStreak: 7,
    favoriteGenre: "Fiction",
    averageRating: 4.2,
    readingGoal: 24,
    monthlyProgress: [
      { month: "Jan", books: 2 },
      { month: "Feb", books: 3 },
      { month: "Mar", books: 1 },
      { month: "Apr", books: 4 },
      { month: "May", books: 2 },
    ],
  })

  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const loadChartData = async () => {
      setChartData({
        labels: readingStats.monthlyProgress.map((item) => item.month),
        datasets: [
          {
            label: "Books Read",
            data: readingStats.monthlyProgress.map((item) => item.books),
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
          },
        ],
      })
    }

    loadChartData()
  }, [readingStats])

  const progressPercentage = (readingStats.booksRead / readingStats.readingGoal) * 100

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Reading Statistics</h1>
          <p className="text-muted-foreground">Track your reading progress and discover your reading patterns.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Books Read</p>
                  <p className="text-2xl font-bold">{readingStats.booksRead}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pages Read</p>
                  <p className="text-2xl font-bold">{readingStats.pagesRead.toLocaleString()}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reading Streak</p>
                  <p className="text-2xl font-bold">{readingStats.readingStreak} days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{readingStats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              2025 Reading Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {readingStats.booksRead} of {readingStats.readingGoal} books
                </span>
                <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {readingStats.readingGoal - readingStats.booksRead} books remaining to reach your goal!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Reading Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readingStats.monthlyProgress.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(month.books / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{month.books}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reading Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Favorite Genre</span>
                <Badge variant="secondary">{readingStats.favoriteGenre}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Pages per Book</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(readingStats.pagesRead / readingStats.booksRead)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Books per Month</span>
                <span className="text-sm text-muted-foreground">{(readingStats.booksRead / 5).toFixed(1)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reading Consistency</span>
                <Badge variant="default" className="bg-green-500">
                  Excellent
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">The Great Gatsby</h4>
                  <p className="text-sm text-muted-foreground">Finished reading • 2 days ago</p>
                </div>
                <Badge variant="outline">Fiction</Badge>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Atomic Habits</h4>
                  <p className="text-sm text-muted-foreground">Currently reading • Page 156 of 320</p>
                </div>
                <Badge variant="outline">Self-Help</Badge>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Dune</h4>
                  <p className="text-sm text-muted-foreground">Added to reading list • 1 week ago</p>
                </div>
                <Badge variant="outline">Sci-Fi</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
