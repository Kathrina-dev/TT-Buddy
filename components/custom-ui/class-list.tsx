"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { Course, Class } from "@/lib/types"

interface ClassListProps {
  course: Course
  onAddClass: (classData: Class) => void
  onDeleteClass: (classId: string) => void
}

export default function ClassList({ course, onAddClass, onDeleteClass }: ClassListProps) {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<"lecture" | "lab" | "tutorial">("lecture")
  const [instructor, setInstructor] = useState("")
  const [room, setRoom] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:30")
  const [days, setDays] = useState<string[]>([])

  const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!instructor.trim() || !room.trim() || days.length === 0) return

    const classData: Class = {
      id: Date.now().toString(),
      courseId: course.id,
      type,
      instructor: instructor.trim(),
      room: room.trim(),
      startTime,
      endTime,
      days,
    }

    onAddClass(classData)
    setType("lecture")
    setInstructor("")
    setRoom("")
    setStartTime("09:00")
    setEndTime("10:30")
    setDays([])
    setShowForm(false)
  }

  const toggleDay = (day: string) => {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-4 block">Classes</Label>
        {course.classes.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No classes added yet</p>
        ) : (
          <div className="space-y-2">
            {course.classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-sm capitalize">{cls.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {cls.startTime} - {cls.endTime} | {cls.days.join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cls.instructor} | {cls.room}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteClass(cls.id)}
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
            <CardTitle className="text-lg">Add Class</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Class Type</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as "lecture" | "lab" | "tutorial")}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="lecture">Lecture</option>
                  <option value="lab">Lab</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  placeholder="e.g., Dr. Smith"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input id="room" placeholder="e.g., A101" value={room} onChange={(e) => setRoom(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Days</Label>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        days.includes(day)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Class
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="w-full gap-2" variant="outline">
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      )}
    </div>
  )
}
