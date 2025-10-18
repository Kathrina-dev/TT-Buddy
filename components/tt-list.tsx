"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Trash2, Eye, Plus } from "lucide-react"
import Link from "next/link"
import type { Semester, Timetable } from "@/lib/types"
import { getSemester, saveSemester, deleteTimetable } from "@/lib/storage"

interface TTListProps {
    id: string;
}

export default function TimetablesList({ id }: TTListProps) {
  const params = useParams()
  const router = useRouter()

  const [semester, setSemester] = useState<Semester | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSemester = async () => {
      const data = await getSemester(id)
      setSemester(data)
      setLoading(false)
    }
    loadSemester()
  }, [id])

  const handleDeleteTimetable = async (timetableId: string) => {
    if (semester && confirm("Delete this timetable?")) {
      await deleteTimetable(id, timetableId)
      setSemester({
        ...semester,
        timetables: semester.timetables.filter((t) => t.id !== timetableId),
      })
    }
  }

  const handleDuplicateTimetable = async (timetable: Timetable) => {
    if (semester) {
      const newTimetable: Timetable = {
        ...timetable,
        id: Date.now().toString(),
        name: `${timetable.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const updated = {
        ...semester,
        timetables: [...semester.timetables, newTimetable],
      }
      setSemester(updated)
      await saveSemester(updated)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timetables...</p>
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
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/semester/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Timetables</h1>
            <p className="text-muted-foreground">{semester.name}</p>
          </div>
        </div>

        {/* Create New Timetable Button */}
        <div className="mb-8">
          <Link href={`/timetable/${id}`}>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Create New Timetable
            </Button>
          </Link>
        </div>

        {/* Timetables Grid */}
        {semester.timetables.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">No timetables yet</h3>
                <p className="text-muted-foreground mb-6">Create your first timetable to get started</p>
                <Link href={`/timetable/${id}`}>
                  <Button>Create Timetable</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {semester.timetables.map((timetable) => (
              <Card key={timetable.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{timetable.name}</CardTitle>
                  <CardDescription>{timetable.classes.length} classes</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p>Created: {new Date(timetable.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/timetable/${id}/${timetable.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateTimetable(timetable)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTimetable(timetable.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
