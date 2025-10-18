"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, GripVertical } from "lucide-react"
import Link from "next/link"
import type { Semester, Timetable, Class } from "@/lib/types"
import { getSemester, saveTimetable } from "@/lib/storage"
import TimetableGrid from "@/components/custom-ui/timetable-grid"

interface TimetableProps {
  semesterId: string;
}

export default function Timetable({ semesterId }: TimetableProps) {
  const params = useParams()
  const router = useRouter()

  const [semester, setSemester] = useState<Semester | null>(null)
  const [loading, setLoading] = useState(true)
  const [timetableName, setTimetableName] = useState("My Timetable")
  const [selectedClasses, setSelectedClasses] = useState<Class[]>([])
  const [draggedClass, setDraggedClass] = useState<Class | null>(null)

  useEffect(() => {
    const loadSemester = async () => {
      const data = await getSemester(semesterId)
      setSemester(data)
      setLoading(false)
    }
    loadSemester()
  }, [semesterId])

  const handleAddClass = (classData: Class) => {
    if (!selectedClasses.find((c) => c.id === classData.id)) {
      setSelectedClasses([...selectedClasses, classData])
    }
  }

  const handleRemoveClass = (classId: string) => {
    setSelectedClasses(selectedClasses.filter((c) => c.id !== classId))
  }

  const handleDragStart = (e: React.DragEvent, cls: Class) => {
    setDraggedClass(cls)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedClass(null)
  }

  const handleSaveTimetable = async () => {
    if (!semester) return

    const timetable: Timetable = {
      id: Date.now().toString(),
      semesterId,
      name: timetableName,
      classes: selectedClasses,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await saveTimetable(semesterId, timetable)
    router.push(`/semester/${semesterId}/timetables`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading semester...</p>
        </div>
      </div>
    )
  }

  if (!semester) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
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
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/semester/${semesterId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Build Timetable</h1>
              <p className="text-muted-foreground">{semester.name}</p>
            </div>
          </div>
          <Button onClick={handleSaveTimetable} className="gap-2">
            <Save className="w-5 h-5" />
            Save Timetable
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Available Classes */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Available Classes</CardTitle>
                <CardDescription>Drag to add or click</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {semester.courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No courses available</p>
                ) : (
                  semester.courses.map((course) => (
                    <div key={course.id} className="space-y-1">
                      <p className="font-semibold text-sm text-foreground">{course.code}</p>
                      {course.classes.map((cls) => (
                        <button
                          key={cls.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, cls)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleAddClass(cls)}
                          disabled={selectedClasses.some((c) => c.id === cls.id)}
                          className={`w-full text-left p-2 rounded text-xs transition-all flex items-center gap-2 ${
                            selectedClasses.some((c) => c.id === cls.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80 text-foreground"
                          } ${draggedClass?.id === cls.id ? "opacity-50" : ""}`}
                        >
                          <GripVertical className="w-3 h-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="capitalize font-medium text-xs">{cls.type}</p>
                            <p className="opacity-75 text-xs">
                              {cls.startTime} - {cls.endTime}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timetable Grid */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Timetable</CardTitle>
                <CardDescription>Your schedule at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <TimetableGrid classes={selectedClasses} onRemoveClass={handleRemoveClass} />
              </CardContent>
            </Card>

            {/* Selected Classes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Selected Classes ({selectedClasses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedClasses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No classes selected</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {semester.courses.find((c) => c.id === cls.courseId)?.code}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{cls.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {cls.startTime} - {cls.endTime} | {cls.days.join(", ")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveClass(cls.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
