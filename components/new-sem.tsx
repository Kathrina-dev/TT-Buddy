"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export default function NewSemester() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      alert(`Semester "${name}" created!`)
      setLoading(false)
      // router.push(`/${semester.id}`)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-slate-100 overflow-hidden flex items-center justify-center p-4">
      <div className="w-full max-w-xl z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="items-center border-2 rounded-2xl">
          <Card className="bg-white border border-gray-200 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-700">Create Semester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="-mt-5 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-slate-600 font-medium">
                    Semester Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Fall 2024-25, Winter 2025-26"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                    className="bg-slate-100 border-1 border-slate-400 text-slate-600 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 h-12 text-base mb-1"
                  />
                </div>

                <Button 
                  size="lg"
                  onClick={handleSubmit}
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base px-8 py-6 rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border-0" 
                  disabled={loading || !name.trim()}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-4 border-primary border-t-accent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Semester
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}