"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { Course, Class } from "@/lib/types"

interface ClassListProps {
  course: Course
  onAddClass: (classData: Class[]) => void
  onDeleteClass: (classId: string) => void
}

export default function ClassList({ course, onAddClass, onDeleteClass }: ClassListProps) {
  const [showForm, setShowForm] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [localClasses, setLocalClasses] = useState<string[]>([])

  // Display classes: use localClasses first
  const courseClasses = localClasses

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const newClasses: Class[] = lines.map((line) => ({
      id: `${Date.now()}-${Math.random()}`,
      courseId: course.id,
      type: "lecture", // default type
      instructor: "",
      room: "",
      startTime: "",
      endTime: "",
      days: [],
    }))

    // Save lines locally for display
    setLocalClasses((prev) => [...prev, ...lines])

    // Send Class objects to parent
    onAddClass(newClasses)

    setInputValue("")
    setShowForm(false)
  }

  const handleDelete = (index: number) => {
    // Remove from local state
    const updated = [...localClasses]
    updated.splice(index, 1)
    setLocalClasses(updated)

    // Notify parent to remove by class id
    // This assumes the parent has the same order mapping
    // Or you could extend localClasses to store {text, id} if needed
    // onDeleteClass(...) 
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-4 block">Classes</Label>
        {courseClasses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No classes added yet</p>
        ) : (
          <div className="space-y-2">
            {courseClasses.map((text, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg shadow-sm"
              >
                <p className="text-sm font-medium whitespace-pre-wrap">{text}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste multiple lines here — each line will become a card..."
                className="w-full min-h-[150px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Classes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      )}
    </div>
  )
}
