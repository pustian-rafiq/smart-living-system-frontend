'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar'
import { AttendanceTable } from '@/components/attendance/AttendanceTable'
import { AttendanceSummaryCard } from '@/components/attendance/AttendanceSummaryCard'
import {
  getAttendanceByStudent,
  getAttendanceSummary,
} from '@/lib/api/messDomain'
import { fetchMessById, fetchMessStudents } from '@/lib/api/mess'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { ok } from '@/lib/api/http'
import { useMockQuery } from '@/hooks/useMockQuery'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { Calendar, FileText } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import type { AttendanceRecord, AttendanceSummary } from '@/types/attendance'

export default function StudentAttendancePage() {
  const t = useTranslations('mess')
  const router = useRouter()
  const role = getStoredRole()
  const tenantId = getCurrentAccountUserId()

  const loadStudents = useCallback(() => fetchMessStudents(), [])
  const { data: students } = useMockQuery(loadStudents)
  const student = useMemo(
    () =>
      students?.find(s => s.id === tenantId) ??
      students?.find(s => s.messId) ??
      students?.[0],
    [students, tenantId]
  )

  const loadMess = useCallback(
    () =>
      student?.messId
        ? fetchMessById(student.messId)
        : Promise.resolve(ok(undefined)),
    [student?.messId]
  )
  const { data: mess } = useMockQuery(loadMess)

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(
    null
  )

  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')

  useEffect(() => {
    if (!student?.id || !mess?.id) return
    void getAttendanceByStudent(student.id, mess.id).then(setAttendanceRecords)
  }, [student?.id, mess?.id])

  useEffect(() => {
    if (!student?.id || !mess?.id) return
    void getAttendanceSummary(student.id, mess.id, monthStart, monthEnd).then(
      setAttendanceSummary
    )
  }, [student?.id, mess?.id, monthStart, monthEnd])

  useEffect(() => {
    if (role !== 'renter') {
      router.replace('/dashboard')
    }
  }, [role, router])

  if (role !== 'renter') {
    return null
  }

  if (!student || !mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">
            {t('studentDashboard.emptyStudentInfo')}
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {t('studentDashboard.myAttendance')}
          </h1>
          <p className="text-muted-foreground">{mess.name}</p>
        </div>

        {attendanceSummary && (
          <div className="mb-6">
            <AttendanceSummaryCard summary={attendanceSummary} />
          </div>
        )}

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              {t('studentDashboard.tabs.calendar')}
            </TabsTrigger>
            <TabsTrigger value="records">
              <FileText className="h-4 w-4 mr-2" />
              {t('studentDashboard.tabs.records')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <AttendanceCalendar
              records={attendanceRecords}
              studentId={student.id}
            />
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <AttendanceTable
              records={attendanceRecords}
              showStudentName={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
