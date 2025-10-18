"use client"

import type React from "react"

import { useState } from "react"
import type { Class } from "@/lib/types"

interface TimetableGridProps {
  classes: Class[]
  onRemoveClass: (classId: string) => void
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const getColorForClass = (index: number) => {
  const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700 text-white dark:from-blue-600 dark:to-blue-700 dark:border-blue-400 dark:text-white shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-purple-500 to-purple-600 border-purple-700 text-white dark:from-purple-600 dark:to-purple-700 dark:border-purple-400 dark:text-white shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-green-500 to-green-600 border-green-700 text-white dark:from-green-600 dark:to-green-700 dark:border-green-400 dark:text-white shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-700 text-white dark:from-orange-600 dark:to-orange-700 dark:border-orange-400 dark:text-white shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-red-500 to-red-600 border-red-700 text-white dark:from-red-600 dark:to-red-700 dark:border-red-400 dark:text-white shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-700 text-white dark:from-cyan-600 dark:to-cyan-700 dark:border-cyan-400 dark:text-white shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-700 text-gray-900 dark:from-yellow-600 dark:to-yellow-700 dark:border-yellow-400 dark:text-gray-900 shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-pink-500 to-pink-600 border-pink-700 text-white dark:from-pink-600 dark:to-pink-700 dark:border-pink-400 dark:text-white shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-700 text-white dark:from-indigo-600 dark:to-indigo-700 dark:border-indigo-400 dark:text-white shadow-lg hover:shadow-xl",
    "bg-gradient-to-br from-teal-500 to-teal-600 border-teal-700 text-white dark:from-teal-600 dark:to-teal-700 dark:border-teal-400 dark:text-white shadow-lg hover:shadow-xl",
  ]
  return colors[index % colors.length]
}

export default function TimetableGrid({ classes, onRemoveClass }: TimetableGridProps) {
  const [draggedClass, setDraggedClass] = useState<Class | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const getClassesForSlot = (day: string, hour: number) => {
    return classes.filter((cls) => {
      if (!cls.days.includes(day)) return false
      const startMinutes = timeToMinutes(cls.startTime)
      const endMinutes = timeToMinutes(cls.endTime)
      const slotStart = hour * 60
      const slotEnd = (hour + 1) * 60
      return startMinutes < slotEnd && endMinutes > slotStart
    })
  }

  const handleDragStart = (e: React.DragEvent, cls: Class) => {
    setDraggedClass(cls)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", cls.id)
  }

  const handleDragEnd = () => {
    setDraggedClass(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    // Drop functionality can be extended for rescheduling
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-xl">
      <div className="inline-block min-w-full">
        {/* Header */}
        <div className="grid gap-1" style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}>
          <div className="p-3 font-bold text-sm text-center bg-gradient-to-r from-primary to-accent text-white rounded-tl-lg">
            Time
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-3 font-bold text-sm text-center bg-gradient-to-r from-primary to-accent text-white"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-1" style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}>
          {HOURS.map((hour) => (
            <div key={`row-${hour}`} className="contents">
              <div className="p-3 text-xs font-bold text-center bg-gradient-to-b from-primary/20 to-accent/20 text-foreground border-b border-border">
                {hour}:00
              </div>
              {DAYS.map((day) => {
                const slotClasses = getClassesForSlot(day, hour)
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="min-h-24 p-2 border-2 border-border rounded-lg bg-card/50 relative smooth-transition hover:bg-card hover:border-primary/30"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {slotClasses.map((cls, idx) => (
                      <div
                        key={cls.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, cls)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onRemoveClass(cls.id)}
                        className={`p-2 rounded-lg text-xs cursor-move hover:scale-105 smooth-transition border-2 font-bold ${getColorForClass(idx)} ${
                          draggedClass?.id === cls.id ? "opacity-50 scale-95" : ""
                        }`}
                      >
                        <p className="truncate text-xs font-bold">
                          {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                        </p>
                        <p className="truncate text-xs opacity-90 font-semibold">{cls.room}</p>
                        <p className="truncate text-xs opacity-90 font-semibold">
                          {cls.startTime} - {cls.endTime}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
