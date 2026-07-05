'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar'
import { AttendanceTable } from '@/components/attendance/AttendanceTable'
import { AttendanceSummaryCard } from '@/components/attendance/AttendanceSummaryCard'
import { MarkAttendanceDialog } from '@/components/attendance/MarkAttendanceDialog'
import { AttendanceReportDialog } from '@/components/attendance/AttendanceReportDialog'
import {
  getAttendanceByMess,
  getAttendanceByDate,
  getAttendanceSummary,
  markAttendance,
  bulkMarkAttendance,
  generateAttendanceReport,
} from '@/lib/api/messDomain'
import { fetchMessById, fetchMessStudents } from '@/lib/api/mess'
import { getDemoOwnerId } from '@/lib/api/demoUser'
import { useMockQuery } from '@/hooks/useMockQuery'
import { getStoredRole } from '@/utils/auth'
import { Plus, Calendar, FileText, Users } from 'lucide-react'
import type { AttendanceRecord } from '@/types/attendance'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { toast } from '@/lib/feedback/toast'

export default function AttendanceManagementPage() {
  const t = useTranslations('mess')
  const tc = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const role = getStoredRole()
  const messId = params.messId as string
  const ownerId = getDemoOwnerId()

  const loadMess = useCallback(() => fetchMessById(messId), [messId])
  const { data: mess } = useMockQuery(loadMess)

  const loadStudents = useCallback(() => fetchMessStudents(messId), [messId])
  const { data: allStudents } = useMockQuery(loadStudents)
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [selectedStudent, setSelectedStudent] = useState<string>('all')
  const [attendanceRecords, setAttendanceRecords] = useState(
    getAttendanceByMess(messId)
  )
  const [isMarkDialogOpen, setIsMarkDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(
    null
  )

  useEffect(() => {
    if (role !== 'owner') {
      router.replace('/dashboard')
    }
  }, [role, router])

  if (role !== 'owner') {
    return null
  }

  if (!mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">{t('notFound')}</p>
        </div>
      </Layout>
    )
  }

  const messStudents = (allStudents ?? []).filter(s => s.seatNumber)

  const filteredRecords = useMemo(() => {
    let records = attendanceRecords

    if (selectedStudent !== 'all') {
      records = records.filter(r => r.studentId === selectedStudent)
    }

    return records
  }, [attendanceRecords, selectedStudent])

  const todayRecords = useMemo(
    () => getAttendanceByDate(messId, selectedDate),
    [messId, selectedDate]
  )

  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')

  const studentSummaries = useMemo(() => {
    return messStudents.map(student =>
      getAttendanceSummary(student.id, messId, monthStart, monthEnd)
    )
  }, [messStudents, messId, monthStart, monthEnd])

  const handleMarkAttendance = (data: any) => {
    const records = data.studentIds.map((studentId: string) => ({
      studentId,
      studentName:
        messStudents.find(s => s.id === studentId)?.name || 'Unknown',
      messId,
      date: data.date,
      status: data.status,
      type: data.type,
      checkInTime: data.checkInTime
        ? new Date(`${data.date}T${data.checkInTime}`).toISOString()
        : undefined,
      checkOutTime: data.checkOutTime
        ? new Date(`${data.date}T${data.checkOutTime}`).toISOString()
        : undefined,
      mealCategory: data.mealCategory,
      notes: data.notes,
      markedBy: ownerId,
    }))

    bulkMarkAttendance(records)
    setAttendanceRecords(getAttendanceByMess(messId))
  }

  const handleGenerateReport = (data: any) => {
    const report = generateAttendanceReport(
      messId,
      data.reportType,
      data.startDate,
      data.endDate,
      ownerId
    )
    toast.success(
      t('attendance.reportGenerated', { fileName: report.fileName ?? '' })
    )
    // In real app, download the report
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    setIsMarkDialogOpen(true)
  }

  return (
    <Layout userRole="owner">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('attendance.managementTitle')}
            </h1>
            <p className="text-muted-foreground">{mess.name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReportDialogOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('attendance.generateReport')}
            </Button>
            <Button onClick={() => setIsMarkDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('attendance.markAttendance')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                {t('attendance.totalStudents')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{messStudents.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                {t('attendance.todayPresent')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {todayRecords.filter(r => r.status === 'present').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                {t('attendance.todayAbsent')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {todayRecords.filter(r => r.status === 'absent').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                {t('attendance.totalRecords')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{attendanceRecords.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="calendar">
                {t('attendance.tabs.calendar')}
              </TabsTrigger>
              <TabsTrigger value="records">
                {t('attendance.tabs.records')}
              </TabsTrigger>
              <TabsTrigger value="summaries">
                {t('attendance.tabs.summaries')}
              </TabsTrigger>
            </TabsList>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('attendance.allStudents')}
                </SelectItem>
                {messStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <AttendanceCalendar
              records={filteredRecords}
              onDateClick={handleDateClick}
              studentId={
                selectedStudent !== 'all' ? selectedStudent : undefined
              }
            />
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records" className="space-y-4">
            <AttendanceTable
              records={filteredRecords}
              onEdit={record => {
                setEditingRecord(record)
                setSelectedDate(record.date)
                setIsMarkDialogOpen(true)
              }}
              showStudentName={selectedStudent === 'all'}
            />
          </TabsContent>

          {/* Summaries Tab */}
          <TabsContent value="summaries" className="space-y-4">
            {studentSummaries.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {studentSummaries.map(summary => (
                  <AttendanceSummaryCard
                    key={summary.studentId}
                    summary={summary}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {t('attendance.emptySummaries')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <MarkAttendanceDialog
          messId={messId}
          date={selectedDate}
          open={isMarkDialogOpen}
          onOpenChange={open => {
            setIsMarkDialogOpen(open)
            if (!open) {
              setEditingRecord(null)
              setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
            }
          }}
          onSubmit={handleMarkAttendance}
        />
        <AttendanceReportDialog
          open={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
          onSubmit={handleGenerateReport}
        />
      </div>
    </Layout>
  )
}
