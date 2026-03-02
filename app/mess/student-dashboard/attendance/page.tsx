'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar'
import { AttendanceTable } from '@/components/attendance/AttendanceTable'
import { AttendanceSummaryCard } from '@/components/attendance/AttendanceSummaryCard'
import {
  getAttendanceByStudent,
  getAttendanceSummary,
} from '@/data/mockAttendance'
import { mockMess, mockStudents } from '@/data/mockMess'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { Calendar, FileText } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

export default function StudentAttendancePage() {
  const router = useRouter()
  const role = getStoredRole()

  // In real app, get from auth
  const student = mockStudents[0]
  const mess = mockMess.find(m => m.id === 'm1')

  const [attendanceRecords, setAttendanceRecords] = useState(
    getAttendanceByStudent(student?.id || '', mess?.id || '')
  )

  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')

  const attendanceSummary = useMemo(() => {
    if (!student || !mess) return null
    return getAttendanceSummary(student.id, mess.id, monthStart, monthEnd)
  }, [student, mess, monthStart, monthEnd])

  if (role !== 'renter') {
    router.replace('/dashboard')
    return null
  }

  if (!student || !mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">Student information not found</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Attendance</h1>
          <p className="text-muted-foreground">{mess.name}</p>
        </div>

        {/* Summary Card */}
        {attendanceSummary && (
          <div className="mb-6">
            <AttendanceSummaryCard summary={attendanceSummary} />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="records">
              <FileText className="h-4 w-4 mr-2" />
              Records
            </TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <AttendanceCalendar
              records={attendanceRecords}
              studentId={student.id}
            />
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records" className="space-y-4">
            <AttendanceTable records={attendanceRecords} showStudentName={false} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
