"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, BookOpen } from "lucide-react"
import Link from "next/link"
import type { Semester, Course, Class } from "@/lib/types"
import { getSemester, saveSemester, deleteCourse } from "@/lib/storage"
import CourseForm from "@/components/custom-ui/course-form"
import ClassList from "@/components/custom-ui/class-list"

const vibrantColors = [
  {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    border: "border-blue-500 dark:border-blue-400",
    text: "text-blue-900 dark:text-blue-100",
    accent: "from-blue-500 to-blue-400",
    button: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
  },
  {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    border: "border-purple-500 dark:border-purple-400",
    text: "text-purple-900 dark:text-purple-100",
    accent: "from-purple-500 to-purple-400",
    button: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100",
  },
  {
    bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    border: "border-green-500 dark:border-green-400",
    text: "text-green-900 dark:text-green-100",
    accent: "from-green-500 to-green-400",
    button: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100",
  },
  {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    border: "border-orange-500 dark:border-orange-400",
    text: "text-orange-900 dark:text-orange-100",
    accent: "from-orange-500 to-orange-400",
    button: "bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100",
  },
  {
    bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
    border: "border-red-500 dark:border-red-400",
    text: "text-red-900 dark:text-red-100",
    accent: "from-red-500 to-red-400",
    button: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100",
  },
  {
    bg: "bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900",
    border: "border-cyan-500 dark:border-cyan-400",
    text: "text-cyan-900 dark:text-cyan-100",
    accent: "from-cyan-500 to-cyan-400",
    button: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-cyan-200 text-cyan-900 dark:bg-cyan-800 dark:text-cyan-100",
  },
  {
    bg: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    border: "border-yellow-500 dark:border-yellow-400",
    text: "text-yellow-900 dark:text-yellow-100",
    accent: "from-yellow-500 to-yellow-400",
    button: "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100",
  },
  {
    bg: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900",
    border: "border-pink-500 dark:border-pink-400",
    text: "text-pink-900 dark:text-pink-100",
    accent: "from-pink-500 to-pink-400",
    button: "bg-pink-600 hover:bg-pink-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100",
  },
  {
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900",
    border: "border-indigo-500 dark:border-indigo-400",
    text: "text-indigo-900 dark:text-indigo-100",
    accent: "from-indigo-500 to-indigo-400",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100",
  },
  {
    bg: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900",
    border: "border-teal-500 dark:border-teal-400",
    text: "text-teal-900 dark:text-teal-100",
    accent: "from-teal-500 to-teal-400",
    button: "bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl",
    badge: "bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100",
  },
]

const getColorForCourse = (index: number) => {
  return vibrantColors[index % vibrantColors.length]
}

interface SetupCoursesProps {
    id: string;
}

export default function SemesterSetup({ id }: SetupCoursesProps) {
  const params = useParams()
  const router = useRouter()

  const [semester, setSemester] = useState<Semester | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCourseForm, setShowCourseForm] = useState(false)

  useEffect(() => {
    const loadSemester = async () => {
      const data = await getSemester(id)
      setSemester(data)
      setLoading(false)
    }
    loadSemester()
  }, [id])

  const handleAddCourse = async (course: Course) => {
    if (semester) {
      const updated = {
        ...semester,
        courses: [...semester.courses, course],
        updatedAt: new Date().toISOString(),
      }
      setSemester(updated)
      await saveSemester(updated)
      setShowCourseForm(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (semester && confirm("Delete this course?")) {
      await deleteCourse(id, courseId)
      setSemester({
        ...semester,
        courses: semester.courses.filter((c) => c.id !== courseId),
      })
      setSelectedCourse(null)
    }
  }

  const handleAddClass = async (classData: Class) => {
    if (semester && selectedCourse) {
      const updatedCourses = semester.courses.map((c) =>
        c.id === selectedCourse.id ? { ...c, classes: [...c.classes, classData] } : c,
      )
      const updated = { ...semester, courses: updatedCourses, updatedAt: new Date().toISOString() }
      setSemester(updated)
      await saveSemester(updated)
      setSelectedCourse(updatedCourses.find((c) => c.id === selectedCourse.id) || null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg font-medium">Loading semester...</p>
        </div>
      </div>
    )
  }

  if (!semester) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Semester not found</p>
            <Link href="/">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-slide-in">
          <Link href="/">
            <Button variant="ghost" size="icon" className="button-hover">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-700">
              {semester.name}
            </h1>
            <p className="text-lg font-medium text-slate-400">Setup courses and classes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-xl py-0">
              <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-300 text-white rounded-t-lg py-4 px-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Courses
                </CardTitle>
                <CardDescription className="text-white/80">{semester.courses.length} courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 py-4 ">
                {semester.courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No courses yet</p>
                ) : (
                  semester.courses.map((course, index) => {
                    const color = getColorForCourse(index)
                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className={`p-3 rounded-lg cursor-pointer smooth-transition border-1 ${color.border} ${
                          selectedCourse?.id === course.id
                            ? `${color.bg} ${color.text} font-bold shadow-lg scale-105`
                            : `${color.bg} ${color.text} hover:shadow-md hover:scale-102`
                        }`}
                      >
                        <p className="font-bold text-sm">{course.code}</p>
                        <p className="text-xs opacity-90">{course.name}</p>
                      </div>
                    )
                  })
                )}
                <Button
                  onClick={() => setShowCourseForm(true)}
                  className="w-full mt-4 gap-2 bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white font-bold button-hover"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Course
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Course Details */}
          <div className="lg:col-span-2">
            {showCourseForm ? (
              <CourseForm onSubmit={handleAddCourse} onCancel={() => setShowCourseForm(false)} />
            ) : selectedCourse ? (
              (() => {
                const index = semester.courses.findIndex(c => c.id === selectedCourse.id)
                const color = getColorForCourse(index)

                return (
                  <Card className="shadow-xl animate-bounce-in py-0">
                    <CardHeader className={`rounded-t-lg py-4 px-4 ${color.badge} ${color.text}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl font-black">{selectedCourse.code}</CardTitle>
                          <CardDescription className="text-slate-500">{selectedCourse.name}</CardDescription>
                        </div>
                        <Button
                          variant="destructive"
                          size="lg"
                          onClick={() => handleDeleteCourse(selectedCourse.id)}
                          className="font-bold"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 py-4">
                      <div>
                        <Label className="text-base font-bold mb-4 block">Course Details</Label>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className={`p-3 ${color.badge} ${color.text} rounded-lg`}>
                            <p className="text-muted-foreground font-medium">Credits</p>
                            <p className={`font-bold text-lg ${color.text}`}>{selectedCourse.credits}</p>
                          </div>
                        </div>
                      </div>

                      <ClassList
                        course={selectedCourse}
                        onAddClass={handleAddClass}
                        onDeleteClass={async (classId) => {
                          if (confirm("Delete this class?")) {
                            const updated = {
                              ...semester,
                              courses: semester.courses.map((c) =>
                                c.id === selectedCourse.id
                                  ? { ...c, classes: c.classes.filter((cl) => cl.id !== classId) }
                                  : c,
                              ),
                              updatedAt: new Date().toISOString(),
                            }
                            setSemester(updated)
                            await saveSemester(updated)
                            setSelectedCourse(updated.courses.find((c) => c.id === selectedCourse.id) || null)
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                )
              }) ()
            ) : (
              <Card className="shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="w-12 h-12 text-primary/30 mb-4" />
                  <p className="text-muted-foreground font-medium">Select a course to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-8 flex-wrap">
          <Link href={`/semester/${id}/timetables`}>
            <Button variant="outline" className="font-bold button-hover bg-transparent">
              View Timetables
            </Button>
          </Link>
          <Link href={`/timetable/${id}`}>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white font-bold button-hover">
              Build New Timetable
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
