export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'meal_attended' | 'meal_absent'

export type AttendanceType = 'general' | 'meal' | 'both'

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  messId: string
  date: string // ISO date string (YYYY-MM-DD)
  status: AttendanceStatus
  type: AttendanceType
  checkInTime?: string // ISO datetime string
  checkOutTime?: string // ISO datetime string
  mealCategory?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  notes?: string
  markedBy: string // User ID who marked the attendance
  markedAt: string // ISO datetime string
}

export interface AttendanceSummary {
  studentId: string
  studentName: string
  messId: string
  period: {
    startDate: string
    endDate: string
  }
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  excusedDays: number
  mealAttended: number
  mealAbsent: number
  attendanceRate: number // percentage
  mealAttendanceRate: number // percentage
}

export interface AttendanceReport {
  id: string
  messId: string
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom'
  period: {
    startDate: string
    endDate: string
  }
  generatedAt: string
  generatedBy: string
  summary: {
    totalStudents: number
    averageAttendanceRate: number
    totalPresentDays: number
    totalAbsentDays: number
    totalLateDays: number
  }
  studentSummaries: AttendanceSummary[]
  fileUrl?: string
  fileName?: string
}
