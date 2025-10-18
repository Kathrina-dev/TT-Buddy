"use client"

import { useState, useEffect, useCallback } from "react"
import type { Semester } from "@/lib/types"
import { getSemesters, saveSemester, getSemester } from "@/lib/storage"

export function useSemesterStorage() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all semesters on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getSemesters()
        setSemesters(data)
        setError(null)
      } catch (err) {
        setError("Failed to load semesters")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Save semester
  const save = useCallback(async (semester: Semester) => {
    try {
      await saveSemester(semester)
      setSemesters((prev) => {
        const index = prev.findIndex((s) => s.id === semester.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = semester
          return updated
        }
        return [...prev, semester]
      })
      setError(null)
    } catch (err) {
      setError("Failed to save semester")
      console.error(err)
    }
  }, [])

  // Get single semester
  const get = useCallback(async (id: string) => {
    try {
      const semester = await getSemester(id)
      setError(null)
      return semester
    } catch (err) {
      setError("Failed to load semester")
      console.error(err)
      return null
    }
  }, [])

  return {
    semesters,
    loading,
    error,
    save,
    get,
  }
}
