"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload } from "lucide-react"
import type { Semester } from "@/lib/types"
import { getSemesters } from "@/lib/storage"

interface ExportImportProps {
  onImport?: (semesters: Semester[]) => void
}

export default function ExportImport({ onImport }: ExportImportProps) {
  const handleExport = async () => {
    try {
      const semesters = await getSemesters()
      const dataStr = JSON.stringify(semesters, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `timetable-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data")
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const semesters = JSON.parse(content) as Semester[]
        if (Array.isArray(semesters)) {
          localStorage.setItem("college-timetable-maker", JSON.stringify(semesters))
          onImport?.(semesters)
          alert("Data imported successfully!")
          window.location.reload()
        } else {
          alert("Invalid file format")
        }
      } catch (error) {
        console.error("Error importing data:", error)
        alert("Failed to import data")
      }
    }
    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>Export or import your timetable data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleExport} className="w-full gap-2 bg-transparent" variant="outline">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
        <div className="relative">
          <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
          <label htmlFor="import-file" className="block">
            <Button asChild className="w-full gap-2 cursor-pointer bg-transparent" variant="outline">
              <span>
                <Upload className="w-4 h-4" />
                Import Data
              </span>
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
