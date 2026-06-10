"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  Users,
  Award,
  BookOpen,
  ThumbsUp,
  Clock,
  Star,
  Trophy,
  Target,
  LogOut,
  User,
  Search,
} from "lucide-react"

interface Question {
  id: number
  question: string
  subject: string
  timeAgo: string
  answers: Answer[]
  likes: number
  solved: boolean
  askedBy: string
}

interface Answer {
  id: number
  answer: string
  timeAgo: string
  likes: number
  isBest: boolean
  answeredBy: string
}

interface UserData {
  name: string
  email: string
  points: number
  questionsAsked: number
  answersGiven: number
  bestAnswers: number
  achievements: string[]
  joinDate: string
}

export default function DoubtsolvePlatform() {
  const [currentView, setCurrentView] = useState<"auth" | "main" | "profile">("auth")
  const [activeTab, setActiveTab] = useState("browse")
  const [isSignUp, setIsSignUp] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)

  // Form states
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" })
  const [newQuestion, setNewQuestion] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Data states
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "How do I solve quadratic equations using the quadratic formula?",
      subject: "Mathematics",
      timeAgo: "2 hours ago",
      answers: [
        {
          id: 1,
          answer:
            "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. First identify a, b, and c from your equation ax² + bx + c = 0, then substitute these values into the formula.",
          timeAgo: "1 hour ago",
          likes: 8,
          isBest: true,
          answeredBy: "MathHelper123",
        },
        {
          id: 2,
          answer:
            "You can also try factoring first if the equation is factorable, it's often easier than using the formula.",
          timeAgo: "45 minutes ago",
          likes: 3,
          isBest: false,
          answeredBy: "StudyBuddy",
        },
      ],
      likes: 12,
      solved: true,
      askedBy: "Anonymous Student",
    },
    {
      id: 2,
      question: "Can someone explain the difference between mitosis and meiosis?",
      subject: "Biology",
      timeAgo: "4 hours ago",
      answers: [
        {
          id: 3,
          answer:
            "Mitosis produces 2 identical diploid cells for growth and repair. Meiosis produces 4 genetically different haploid gametes for reproduction.",
          timeAgo: "3 hours ago",
          likes: 15,
          isBest: true,
          answeredBy: "BioExpert",
        },
      ],
      likes: 8,
      solved: true,
      askedBy: "Anonymous Student",
    },
    {
      id: 3,
      question: "What's the best way to approach essay writing for literature analysis?",
      subject: "English",
      timeAgo: "1 day ago",
      answers: [],
      likes: 15,
      solved: false,
      askedBy: "Anonymous Student",
    },
  ])

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [newAnswer, setNewAnswer] = useState("")

  // Initialize user data
  useEffect(() => {
    const savedUser = localStorage.getItem("doubtsolve_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setCurrentView("main")
    }
  }, [])

  // Authentication functions
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    const userData: UserData = {
      name: authForm.name || authForm.email.split("@")[0],
      email: authForm.email,
      points: 250,
      questionsAsked: 12,
      answersGiven: 8,
      bestAnswers: 3,
      achievements: ["First Question", "Helpful Helper"],
      joinDate: new Date().toLocaleDateString(),
    }
    setUser(userData)
    localStorage.setItem("doubtsolve_user", JSON.stringify(userData))
    setCurrentView("main")
    setAuthForm({ email: "", password: "", name: "" })
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("doubtsolve_user")
    setCurrentView("auth")
  }

  // Question functions
  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim() || !selectedSubject) return

    const question: Question = {
      id: questions.length + 1,
      question: newQuestion,
      subject: selectedSubject,
      timeAgo: "Just now",
      answers: [],
      likes: 0,
      solved: false,
      askedBy: user?.name || "Anonymous",
    }

    setQuestions([question, ...questions])
    setNewQuestion("")
    setSelectedSubject("")
    setActiveTab("browse")

    // Update user stats
    if (user) {
      const updatedUser = { ...user, questionsAsked: user.questionsAsked + 1, points: user.points + 10 }
      setUser(updatedUser)
      localStorage.setItem("doubtsolve_user", JSON.stringify(updatedUser))
    }
  }

  const handlePostAnswer = (questionId: number) => {
    if (!newAnswer.trim()) return

    const answer: Answer = {
      id: Date.now(),
      answer: newAnswer,
      timeAgo: "Just now",
      likes: 0,
      isBest: false,
      answeredBy: user?.name || "Anonymous",
    }

    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q)))

    setNewAnswer("")
    setSelectedQuestion(null)

    // Update user stats
    if (user) {
      const updatedUser = { ...user, answersGiven: user.answersGiven + 1, points: user.points + 20 }
      setUser(updatedUser)
      localStorage.setItem("doubtsolve_user", JSON.stringify(updatedUser))
    }
  }

  const handleLikeQuestion = (questionId: number) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, likes: q.likes + 1 } : q)))
  }

  const handleLikeAnswer = (questionId: number, answerId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) => (a.id === answerId ? { ...a, likes: a.likes + 1 } : a)),
            }
          : q,
      ),
    )
  }

  const handleMarkBestAnswer = (questionId: number, answerId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              solved: true,
              answers: q.answers.map((a) => ({ ...a, isBest: a.id === answerId })),
            }
          : q,
      ),
    )
  }

  // Filter and sort questions
  const filteredQuestions = questions
    .filter((q) => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSubject = filterSubject === "all" || q.subject.toLowerCase() === filterSubject
      return matchesSearch && matchesSubject
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes
        case "unsolved":
          return a.solved === b.solved ? 0 : a.solved ? 1 : -1
        default:
          return 0 // Keep original order for "recent"
      }
    })

  const leaderboard = [
    { name: "Anonymous Helper", points: 1250, badge: "Gold Helper", answers: 45 },
    { name: "Study Buddy", points: 980, badge: "Silver Helper", answers: 32 },
    { name: "Knowledge Seeker", points: 750, badge: "Bronze Helper", answers: 28 },
  ]

  // Auth View
  if (currentView === "auth") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DoubtSolve</h1>
            </div>
            <CardTitle>{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Join our learning community" : "Sign in to continue learning"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    required={isSignUp}
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 hover:underline text-sm">
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Profile View
  if (currentView === "profile" && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">DoubtSolve</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setCurrentView("main")}>
                  Back to Platform
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <Card className="md:col-span-1">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                  <Trophy className="h-4 w-4 mr-2" />
                  {user.points} Points
                </Badge>
                <p className="text-sm text-gray-500 mt-4">Member since {user.joinDate}</p>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{user.questionsAsked}</div>
                    <div className="text-sm text-gray-600">Questions Asked</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{user.answersGiven}</div>
                    <div className="text-sm text-gray-600">Answers Given</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{user.bestAnswers}</div>
                    <div className="text-sm text-gray-600">Best Answers</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{user.achievements.length}</div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-medium">{achievement}</div>
                        <div className="text-sm text-gray-600">Achievement unlocked!</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">Expert Helper</div>
                      <div className="text-sm text-gray-600">Give 25 helpful answers ({user.answersGiven}/25)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Main Platform View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DoubtSolve</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>{user?.points} Points</span>
              </Badge>
              <Button variant="outline" onClick={() => setCurrentView("profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ask Questions. Get Answers. Stay Anonymous.</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Welcome back, {user?.name}! Continue your learning journey in our supportive community.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <div className="text-sm text-gray-600">Questions Asked</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">892</div>
                  <div className="text-sm text-gray-600">Active Helpers</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <Award className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-sm text-gray-600">Questions Solved</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Questions</TabsTrigger>
            <TabsTrigger value="ask">Ask Question</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="dashboard">My Dashboard</TabsTrigger>
          </TabsList>

          {/* Browse Questions */}
          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="unsolved">Unsolved First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredQuestions.map((q) => (
                <Card key={q.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{q.question}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <Badge variant="outline">{q.subject}</Badge>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {q.timeAgo}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {q.answers.length} answers
                          </span>
                          <button
                            onClick={() => handleLikeQuestion(q.id)}
                            className="flex items-center hover:text-blue-600"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {q.likes}
                          </button>
                        </div>

                        {/* Show answers */}
                        {q.answers.length > 0 && (
                          <div className="space-y-3 mt-4 border-t pt-4">
                            {q.answers.map((answer) => (
                              <div key={answer.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-gray-700">{answer.answeredBy}</span>
                                  <div className="flex items-center space-x-2">
                                    {answer.isBest && (
                                      <Badge className="bg-green-100 text-green-800">
                                        <Star className="h-3 w-3 mr-1" />
                                        Best Answer
                                      </Badge>
                                    )}
                                    <span className="text-xs text-gray-500">{answer.timeAgo}</span>
                                  </div>
                                </div>
                                <p className="text-gray-700 mb-2">{answer.answer}</p>
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => handleLikeAnswer(q.id, answer.id)}
                                    className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {answer.likes}
                                  </button>
                                  {!answer.isBest && !q.solved && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMarkBestAnswer(q.id, answer.id)}
                                    >
                                      Mark as Best
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {q.solved && (
                          <Badge className="bg-green-100 text-green-800">
                            <Star className="h-3 w-3 mr-1" />
                            Solved
                          </Badge>
                        )}
                        <Button size="sm" onClick={() => setSelectedQuestion(q)}>
                          Answer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Answer Modal */}
            {selectedQuestion && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Answer Question</CardTitle>
                    <CardDescription>{selectedQuestion.question}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Write your answer here..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      rows={6}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handlePostAnswer(selectedQuestion.id)}>Post Answer</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Ask Question */}
          <TabsContent value="ask">
            <Card>
              <CardHeader>
                <CardTitle>Ask Your Question Anonymously</CardTitle>
                <CardDescription>Don't worry about judgment - be specific to get better answers.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePostQuestion} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Question</label>
                    <Textarea
                      placeholder="Describe your doubt in detail. The more specific you are, the better answers you'll get..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      💡 Tip: Include what you've already tried or where you're stuck
                    </p>
                    <Button type="submit" className="px-8">
                      Post Question
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                  Top Helpers This Month
                </CardTitle>
                <CardDescription>Recognize our amazing community members who help solve doubts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                        <Avatar>
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.answers} answers given</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{user.points} pts</div>
                        <Badge variant="secondary">{user.badge}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Questions Asked</span>
                    <Badge>{user?.questionsAsked}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Answers Given</span>
                    <Badge>{user?.answersGiven}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Best Answers</span>
                    <Badge>{user?.bestAnswers}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Points</span>
                    <Badge className="bg-blue-100 text-blue-800">{user?.points}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user?.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-medium">{achievement}</div>
                        <div className="text-sm text-gray-600">Achievement unlocked!</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">Expert Helper</div>
                      <div className="text-sm text-gray-600">Give 25 helpful answers ({user?.answersGiven}/25)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
