"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Trophy, BookOpen, Zap, CheckCircle } from "lucide-react"

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

interface Quiz {
  id: string
  title: string
  questions: {
    question: string
    options: string[]
    correct: number
  }[]
  completed: boolean
  score?: number
}

export default function KidsPage() {
  const [kidsBooks, setKidsBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const sampleQuizzes: Quiz[] = [
    {
      id: "1",
      title: "Classic Children's Literature",
      completed: false,
      questions: [
        {
          question: 'Who wrote "Charlotte\'s Web"?',
          options: ["E.B. White", "Roald Dahl", "Dr. Seuss", "Maurice Sendak"],
          correct: 0,
        },
        {
          question: "What is the name of Harry Potter's owl?",
          options: ["Errol", "Pigwidgeon", "Hedwig", "Crookshanks"],
          correct: 2,
        },
        {
          question: 'In "The Lion, the Witch and the Wardrobe", what is the name of the magical land?',
          options: ["Narnia", "Wonderland", "Neverland", "Middle-earth"],
          correct: 0,
        },
      ],
    },
    {
      id: "2",
      title: "Adventure Stories",
      completed: false,
      questions: [
        {
          question: 'Who is the author of "Treasure Island"?',
          options: ["Mark Twain", "Robert Louis Stevenson", "Jules Verne", "Daniel Defoe"],
          correct: 1,
        },
        {
          question: "What is the name of Robinson Crusoe's companion?",
          options: ["Friday", "Monday", "Sunday", "Tuesday"],
          correct: 0,
        },
      ],
    },
  ]

  useEffect(() => {
    const fetchKidsBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/search?q=subject:children&limit=20")
        if (response.ok) {
          const data = await response.json()
          setKidsBooks(data.docs || [])
        }
      } catch (error) {
        console.error("Error fetching kids books:", error)
        setKidsBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchKidsBooks()
  }, [])

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setQuizScore(0)
    setShowResults(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const nextQuestion = () => {
    if (selectedAnswer === currentQuiz?.questions[currentQuestion].correct) {
      setQuizScore((prev) => prev + 1)
    }

    if (currentQuestion < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  const finishQuiz = () => {
    setCurrentQuiz(null)
    setShowResults(false)
  }

  if (currentQuiz && !showResults) {
    const question = currentQuiz.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100

    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{currentQuiz.title}</CardTitle>
                <Badge variant="outline">
                  {currentQuestion + 1} / {currentQuiz.questions.length}
                </Badge>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-xl font-semibold">{question.question}</h3>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentQuiz(null)}>
                  Exit Quiz
                </Button>
                <Button onClick={nextQuestion} disabled={selectedAnswer === null}>
                  {currentQuestion === currentQuiz.questions.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults && currentQuiz) {
    const percentage = Math.round((quizScore / currentQuiz.questions.length) * 100)

    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
                <p className="text-muted-foreground">
                  You got {quizScore} out of {currentQuiz.questions.length} questions correct!
                </p>
              </div>

              <div className="space-y-2">
                {percentage >= 80 && (
                  <Badge variant="default" className="bg-green-500">
                    <Star className="h-3 w-3 mr-1" />
                    Excellent!
                  </Badge>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <Badge variant="default" className="bg-blue-500">
                    Good Job!
                  </Badge>
                )}
                {percentage < 60 && <Badge variant="outline">Keep Practicing!</Badge>}
              </div>

              <Button onClick={finishQuiz} className="w-full">
                Back to Kids Section
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kids Corner 📚
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing books and test your knowledge with fun quizzes!
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            Reading Quizzes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{quiz.questions.length} questions</p>
                    </div>
                    {quiz.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => startQuiz(quiz)}
                    className="w-full"
                    variant={quiz.completed ? "outline" : "default"}
                  >
                    {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Books for Young Readers
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : kidsBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {kidsBooks.map((book) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Kids Books Found</h3>
              <p className="text-muted-foreground">
                We're having trouble loading books right now. Please try again later.
              </p>
            </div>
          )}
        </section>

        <section className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">📖 Fun Reading Fact!</h3>
              <p className="text-muted-foreground">
                Did you know that reading for just 20 minutes a day exposes you to about 1.8 million words per year?
                That's like reading 90 average-length books!
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
