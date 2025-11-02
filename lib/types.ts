export interface Course {
  id: string
  code: string
  name: string
  credits: number
  classes: Class[]
}

export interface Class {
  id: string
  courseId: string
  type?: "lecture" | "lab" | "tutorial"
  instructor?: string
  room?: string
  startTime?: string
  endTime?: string
  days?: string[]
}

export interface Timetable {
  id: string
  semesterId: string
  name: string
  classes: Class[]
  createdAt: string
  updatedAt: string
}

export interface Semester {
  id: string
  name: string
  courses: Course[]
  timetables: Timetable[]
  createdAt: string
  updatedAt: string
}
