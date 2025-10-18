import type { Semester, Timetable, Course } from "./types"

const STORAGE_KEY = "college-timetable-maker"

export async function getSemesters(): Promise<Semester[]> {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading semesters from storage:", error)
    return []
  }
}

export async function getSemester(id: string): Promise<Semester | null> {
  try {
    const semesters = await getSemesters()
    return semesters.find((s) => s.id === id) || null
  } catch (error) {
    console.error("Error reading semester from storage:", error)
    return null
  }
}

export async function saveSemester(semester: Semester): Promise<void> {
  try {
    const semesters = await getSemesters()
    const index = semesters.findIndex((s) => s.id === semester.id)
    if (index >= 0) {
      semesters[index] = semester
    } else {
      semesters.push(semester)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters))
  } catch (error) {
    console.error("Error saving semester to storage:", error)
    throw error
  }
}

export async function deleteSemester(id: string): Promise<void> {
  try {
    const semesters = await getSemesters()
    const filtered = semesters.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Error deleting semester from storage:", error)
    throw error
  }
}

export async function createSemester(name: string): Promise<Semester> {
  const semester: Semester = {
    id: Date.now().toString(),
    name,
    courses: [],
    timetables: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await saveSemester(semester)
  return semester
}

export async function addCourse(semesterId: string, course: Course): Promise<void> {
  try {
    const semester = await getSemester(semesterId)
    if (semester) {
      semester.courses.push(course)
      semester.updatedAt = new Date().toISOString()
      await saveSemester(semester)
    }
  } catch (error) {
    console.error("Error adding course to storage:", error)
    throw error
  }
}

export async function deleteCourse(semesterId: string, courseId: string): Promise<void> {
  try {
    const semester = await getSemester(semesterId)
    if (semester) {
      semester.courses = semester.courses.filter((c) => c.id !== courseId)
      semester.updatedAt = new Date().toISOString()
      await saveSemester(semester)
    }
  } catch (error) {
    console.error("Error deleting course from storage:", error)
    throw error
  }
}

export async function saveTimetable(semesterId: string, timetable: Timetable): Promise<void> {
  try {
    const semester = await getSemester(semesterId)
    if (semester) {
      const index = semester.timetables.findIndex((t) => t.id === timetable.id)
      if (index >= 0) {
        semester.timetables[index] = timetable
      } else {
        semester.timetables.push(timetable)
      }
      semester.updatedAt = new Date().toISOString()
      await saveSemester(semester)
    }
  } catch (error) {
    console.error("Error saving timetable to storage:", error)
    throw error
  }
}

export async function deleteTimetable(semesterId: string, timetableId: string): Promise<void> {
  try {
    const semester = await getSemester(semesterId)
    if (semester) {
      semester.timetables = semester.timetables.filter((t) => t.id !== timetableId)
      semester.updatedAt = new Date().toISOString()
      await saveSemester(semester)
    }
  } catch (error) {
    console.error("Error deleting timetable from storage:", error)
    throw error
  }
}
