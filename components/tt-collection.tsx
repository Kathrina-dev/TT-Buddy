"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Edit2 } from "lucide-react"
import Link from "next/link"
import type { Semester, Timetable } from "@/lib/types"
import { getSemester, saveSemester } from "@/lib/storage"
import TimetableGrid from "@/components/custom-ui/timetable-grid"

interface TTCollectionProps {
  semesterId: string;
  timetableId: string;
}

export default function TT_collection({ semesterId, timetableId }: TTCollectionProps) {
  const params = useParams()
  const router = useRouter()

  const [semester, setSemester] = useState<Semester | null>(null)
  const [timetable, setTimetable] = useState<Timetable | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const data = await getSemester(semesterId)
      setSemester(data)
      if (data) {
        const tt = data.timetables.find((t) => t.id === timetableId)
        setTimetable(tt || null)
        if (tt) {
          setEditName(tt.name)
        }
      }
      setLoading(false)
    }
    loadData()
  }, [semesterId, timetableId])

  const handleSaveName = async () => {
    if (semester && timetable && editName.trim()) {
      const updated = {
        ...semester,
        timetables: semester.timetables.map((t) =>
          t.id === timetable.id ? { ...t, name: editName.trim(), updatedAt: new Date().toISOString() } : t,
        ),
      }
      setSemester(updated)
      setTimetable({ ...timetable, name: editName.trim() })
      await saveSemester(updated)
      setIsEditing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timetable...</p>
        </div>
      </div>
    )
  }

  if (!semester || !timetable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Timetable not found</p>
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
            <Link href={`/semester/${semesterId}/timetables`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              {isEditing ? (
                <div className="flex gap-2 items-center">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl font-bold h-auto"
                  />
                  <Button size="sm" onClick={handleSaveName}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-foreground">{timetable.name}</h1>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{semester.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>{timetable.classes.length} classes</CardDescription>
          </CardHeader>
          <CardContent>
            <TimetableGrid classes={timetable.classes} onRemoveClass={() => {}} />
          </CardContent>
        </Card>

        {/* Classes List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Classes in this Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            {timetable.classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes in this timetable</p>
            ) : (
              <div className="space-y-2">
                {timetable.classes.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {semester.courses.find((c) => c.id === cls.courseId)?.code}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{cls.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {cls.startTime} - {cls.endTime} | {cls.days.join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cls.instructor} | {cls.room}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <Link href={`/semester/${semesterId}/timetables`}>
            <Button variant="outline">Back to Timetables</Button>
          </Link>
          <Link href={`/timetable/${semesterId}`}>
            <Button>Create Another Timetable</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
