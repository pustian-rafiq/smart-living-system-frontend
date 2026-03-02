import type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceReport,
  AttendanceStatus,
} from '@/types/attendance'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { mockStudents } from './mockMess'

// Generate attendance records for the last 30 days
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = []
  const today = new Date()
  const messId = 'm1'

  mockStudents.forEach((student, studentIndex) => {
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayOfWeek = date.getDay()

      // Skip weekends for some students (simulate different patterns)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (studentIndex % 3 === 0) {
          // Some students are absent on weekends
          records.push({
            id: `att-${student.id}-${dateStr}`,
            studentId: student.id,
            studentName: student.name,
            messId,
            date: dateStr,
            status: 'absent',
            type: 'both',
            markedBy: 'owner1',
            markedAt: new Date(date.setHours(9, 0, 0, 0)).toISOString(),
          })
          continue
        }
      }

      // Generate random attendance patterns
      const random = Math.random()
      let status: AttendanceStatus = 'present'
      let type: 'general' | 'meal' | 'both' = 'both'

      if (random < 0.1) {
        status = 'absent'
      } else if (random < 0.15) {
        status = 'late'
      } else if (random < 0.2) {
        status = 'excused'
      } else if (random < 0.85) {
        status = 'present'
      }

      // Meal attendance (some students miss meals)
      if (status === 'present' && Math.random() < 0.2) {
        type = 'general' // Present but didn't attend meal
      }

      records.push({
        id: `att-${student.id}-${dateStr}`,
        studentId: student.id,
        studentName: student.name,
        messId,
        date: dateStr,
        status,
        type,
        checkInTime:
          status === 'present' || status === 'late'
            ? new Date(date.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0)).toISOString()
            : undefined,
        checkOutTime:
          status === 'present'
            ? new Date(date.setHours(22 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0)).toISOString()
            : undefined,
        mealCategory: type === 'meal' || type === 'both' ? (['breakfast', 'lunch', 'dinner'] as const)[Math.floor(Math.random() * 3)] : undefined,
        markedBy: 'owner1',
        markedAt: new Date(date.setHours(9, 0, 0, 0)).toISOString(),
      })
    }
  })

  return records
}

export const mockAttendanceRecords: AttendanceRecord[] = generateAttendanceRecords()

export const mockAttendanceReports: AttendanceReport[] = [
  {
    id: 'rep1',
    messId: 'm1',
    reportType: 'monthly',
    period: {
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    },
    generatedAt: new Date().toISOString(),
    generatedBy: 'owner1',
    summary: {
      totalStudents: mockStudents.length,
      averageAttendanceRate: 85.5,
      totalPresentDays: 450,
      totalAbsentDays: 60,
      totalLateDays: 30,
    },
    studentSummaries: [],
    fileUrl: '/reports/attendance-monthly.pdf',
    fileName: 'Attendance_Report_January_2024.pdf',
  },
]

// Helper functions
export function getAttendanceByStudent(
  studentId: string,
  messId: string,
  startDate?: string,
  endDate?: string
): AttendanceRecord[] {
  let records = mockAttendanceRecords.filter(
    r => r.studentId === studentId && r.messId === messId
  )

  if (startDate) {
    records = records.filter(r => r.date >= startDate)
  }
  if (endDate) {
    records = records.filter(r => r.date <= endDate)
  }

  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAttendanceByDate(messId: string, date: string): AttendanceRecord[] {
  return mockAttendanceRecords
    .filter(r => r.messId === messId && r.date === date)
    .sort((a, b) => a.studentName.localeCompare(b.studentName))
}

export function getAttendanceByMess(
  messId: string,
  startDate?: string,
  endDate?: string
): AttendanceRecord[] {
  let records = mockAttendanceRecords.filter(r => r.messId === messId)

  if (startDate) {
    records = records.filter(r => r.date >= startDate)
  }
  if (endDate) {
    records = records.filter(r => r.date <= endDate)
  }

  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAttendanceSummary(
  studentId: string,
  messId: string,
  startDate: string,
  endDate: string
): AttendanceSummary {
  const records = getAttendanceByStudent(studentId, messId, startDate, endDate)
  const totalDays = records.length
  const presentDays = records.filter(r => r.status === 'present').length
  const absentDays = records.filter(r => r.status === 'absent').length
  const lateDays = records.filter(r => r.status === 'late').length
  const excusedDays = records.filter(r => r.status === 'excused').length
  const mealAttended = records.filter(r => r.type === 'meal' || r.type === 'both').length
  const mealAbsent = records.filter(r => r.type === 'general' && r.status === 'present').length

  const student = mockStudents.find(s => s.id === studentId)

  return {
    studentId,
    studentName: student?.name || 'Unknown',
    messId,
    period: { startDate, endDate },
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    excusedDays,
    mealAttended,
    mealAbsent,
    attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
    mealAttendanceRate: totalDays > 0 ? (mealAttended / totalDays) * 100 : 0,
  }
}

export function markAttendance(
  record: Omit<AttendanceRecord, 'id' | 'markedAt'>
): AttendanceRecord {
  // Remove existing record for same student and date
  const existingIndex = mockAttendanceRecords.findIndex(
    r => r.studentId === record.studentId && r.date === record.date && r.type === record.type
  )
  if (existingIndex !== -1) {
    mockAttendanceRecords.splice(existingIndex, 1)
  }

  const newRecord: AttendanceRecord = {
    ...record,
    id: `att-${record.studentId}-${record.date}-${Date.now()}`,
    markedAt: new Date().toISOString(),
  }
  mockAttendanceRecords.push(newRecord)
  return newRecord
}

export function bulkMarkAttendance(
  records: Omit<AttendanceRecord, 'id' | 'markedAt'>[]
): AttendanceRecord[] {
  return records.map(record => markAttendance(record))
}

export function generateAttendanceReport(
  messId: string,
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom',
  startDate: string,
  endDate: string,
  generatedBy: string
): AttendanceReport {
  const records = getAttendanceByMess(messId, startDate, endDate)
  const studentIds = [...new Set(records.map(r => r.studentId))]
  const studentSummaries = studentIds.map(id => getAttendanceSummary(id, messId, startDate, endDate))

  const totalPresentDays = records.filter(r => r.status === 'present').length
  const totalAbsentDays = records.filter(r => r.status === 'absent').length
  const totalLateDays = records.filter(r => r.status === 'late').length
  const averageAttendanceRate =
    studentSummaries.reduce((sum, s) => sum + s.attendanceRate, 0) / studentSummaries.length || 0

  const newReport: AttendanceReport = {
    id: `rep-${Date.now()}`,
    messId,
    reportType,
    period: { startDate, endDate },
    generatedAt: new Date().toISOString(),
    generatedBy,
    summary: {
      totalStudents: studentIds.length,
      averageAttendanceRate,
      totalPresentDays,
      totalAbsentDays,
      totalLateDays,
    },
    studentSummaries,
    fileUrl: `/reports/attendance-${reportType}-${startDate}-${endDate}.pdf`,
    fileName: `Attendance_Report_${reportType}_${startDate}_${endDate}.pdf`,
  }

  mockAttendanceReports.unshift(newReport)
  return newReport
}
