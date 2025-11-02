"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit2, Copy, Trash2, Sparkles, Calendar, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import type { Semester } from "@/lib/types"
import { getSemesters, deleteSemester } from "@/lib/storage"

export default function Dashboard() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSemesters = async () => {
      const data = await getSemesters()
      setSemesters(data)
      setLoading(false)
    }
    loadSemesters()
  }, [])

  const handleDeleteSemester = async (id: string) => {
    if (confirm("Are you sure you want to delete this semester?")) {
      await deleteSemester(id)
      setSemesters(semesters.filter((s) => s.id !== id))
    }
  }

  const handleDuplicateSemester = (semester: Semester) => {
    const newSemester: Semester = {
      ...semester,
      id: Date.now().toString(),
      name: `${semester.name} (Copy)`,
    }
    setSemesters([...semesters, newSemester])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg font-medium">Loading your semesters...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <section className="min-h-[80vh] md:h-[80vh] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-10 flex flex-col items-center justify-start overflow-hidden">        
        {/* Hero Section */}
        <div className="text-center  mb-8 md:mb-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">TT-Buddy</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-white">Everything you need to create</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              the perfect timetable
            </span>
          </h1>
        </div>

        {/* Create New Semester Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-5">
          <Link href="/new-sem">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base px-8 py-6 rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border-0"
            >
              <Plus className="w-5 h-5" />
              Create New Semester
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 bg-white/5 hover:bg-white/10 text-white font-bold text-base px-8 py-6 rounded-xl border-white/20 hover:border-white/40 transition-all duration-300"
          >
            <BookOpen className="w-5 h-5" />
            Learn More
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-10 max-w-5xl mx-auto px-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-1">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Scheduling</h3>
            <p className="text-slate-400">Generate conflict-free timetables automatically based on your course preferences</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-1">
              <BookOpen className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Course Management</h3>
            <p className="text-slate-400">Organize all your courses with sections, timings, and instructor details</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-1">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multiple Schedules</h3>
            <p className="text-slate-400">Create and compare different timetable options to find your perfect schedule</p>
          </div>
        </div>
      </section>

      <section className="bg-white text-slate-900 py-6">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-3xl font-bold text-slate-800 mb-4">Your Semesters</h2>

          {/* Semesters Grid */}
          {semesters.length === 0 ? (
            <Card className="border-2 border-dashed border-purple-500/30 bg-white/5 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Sparkles className="w-16 h-16 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No semesters yet</h3>
                <p className="text-slate-400 mb-6 text-center max-w-sm">
                  Create your first semester to start building amazing timetables
                </p>
                <Link href="/semester/new">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold border-0">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {semesters.map((semester, index) => {
                return (
                  <Card
                    key={semester.id}
                    className="hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border-2 border-slate-300 overflow-hidden"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold text-slate-600">{semester.name}</CardTitle>
                          <CardDescription className="font-slate-400 font-medium mt-1">
                            {semester.courses?.length || 0} courses
                          </CardDescription>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100">
                          {semester.timetables?.length || 0} schedules
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2 flex-wrap">
                          <Link href={`/${semester.id}`} className="flex-1">
                            <Button
                            size="sm"
                            variant="outline"
                            className=" w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border-0"
                          >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicateSemester(semester)}
                            className="gap-2 bg-purple-400 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl border-0 font-bold"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSemester(semester.id)}
                            className="gap-2 font-bold bg-red-500 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
