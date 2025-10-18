"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Course } from "@/lib/types"

interface CourseFormProps {
  onSubmit: (course: Course) => void
  onCancel: () => void
}

export default function CourseForm({ onSubmit, onCancel }: CourseFormProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [credits, setCredits] = useState("3")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !name.trim()) return

    const course: Course = {
      id: Date.now().toString(),
      code: code.trim(),
      name: name.trim(),
      credits: Number.parseInt(credits),
      classes: [],
    }

    onSubmit(course)
    setCode("")
    setName("")
    setCredits("3")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Course Code</Label>
            <Input id="code" placeholder="e.g., CS101" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              placeholder="e.g., Introduction to Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              min="1"
              max="6"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Add Course
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
