"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface TimetablePreferencesProps {
  onPreferencesChange?: (preferences: any) => void
}

export default function TimetablePreferences({ onPreferencesChange }: TimetablePreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="no-gaps" />
          <Label htmlFor="no-gaps" className="font-normal cursor-pointer">
            Minimize gaps between classes
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="no-early" />
          <Label htmlFor="no-early" className="font-normal cursor-pointer">
            No classes before 9 AM
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="no-late" />
          <Label htmlFor="no-late" className="font-normal cursor-pointer">
            No classes after 5 PM
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
