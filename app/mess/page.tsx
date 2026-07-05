'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { MessOverviewCard } from '@/components/mess/MessOverviewCard'
import { AssignStudentDialog } from '@/components/mess/AssignStudentDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStoredRole } from '@/hooks/useStoredRole'
import { mockMess, mockStudents, mockSeats } from '@/data/mockMess'
import type { Mess } from '@/types/mess'
import { LayoutDashboard, GraduationCap, Building2 } from 'lucide-react'

export default function MessOverviewPage() {
  const { ready, isOwner, isRenter } = useStoredRole()
  const [messes, setMesses] = useState(mockMess)
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [assignMessage, setAssignMessage] = useState<string | null>(null)

  const handleAssignStudent = (mess: Mess) => {
    setSelectedMess(mess)
    setIsAssignDialogOpen(true)
  }

  const handleAssign = (data: {
    name: string
    phone: string
    email?: string
    studentId?: string
    university?: string
    seatNumber: string
  }) => {
    if (!selectedMess) return

    const seat = mockSeats.find(
      s =>
        s.messId === selectedMess.id &&
        s.seatNumber === data.seatNumber &&
        s.status === 'available'
    )
    if (seat) {
      seat.status = 'occupied'
      seat.studentId = `s-${Date.now()}`
    }

    mockStudents.push({
      id: `s-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      studentId: data.studentId,
      university: data.university,
      seatNumber: data.seatNumber,
      joinedDate: new Date().toISOString().split('T')[0],
      monthlyFee: selectedMess.monthlyFee,
    })

    setMesses(prev =>
      prev.map(m =>
        m.id === selectedMess.id
          ? {
              ...m,
              availableSeats: Math.max(0, m.availableSeats - 1),
            }
          : m
      )
    )

    setAssignMessage(
      `${data.name} assigned to seat ${data.seatNumber} in ${selectedMess.name}.`
    )
    setIsAssignDialogOpen(false)
    setSelectedMess(null)
  }

  if (!ready) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState label="Loading mess…" />
        </PageContainer>
      </Layout>
    )
  }

  // Renters / students go to their student dashboard
  if (isRenter) {
    return (
      <Layout>
        <PageContainer>
          <PageHeader
            title="My mess"
            description="View your seat, meals, attendance, and pay monthly fees."
          />
          <Card className="max-w-lg border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5" />
                Student dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Open your mess student dashboard for notices, menu, attendance,
                and Pay Now for monthly fees.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/mess/student-dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Open student dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </PageContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Mess management"
          description="Manage seats, meals, attendance, SMS, rules, and expenses."
          actions={
            <Button variant="outline" asChild>
              <Link href="/mess/student-dashboard">
                <GraduationCap className="mr-2 h-4 w-4" />
                Preview student view
              </Link>
            </Button>
          }
        />

        {assignMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
            {assignMessage}
          </div>
        )}

        {messes.length === 0 ? (
          <EmptyState
            title="No mess facilities yet"
            description="Add your first mess or hostel to manage seats and students."
            icon={Building2}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {messes.map(mess => (
              <MessOverviewCard
                key={mess.id}
                mess={mess}
                onAssignStudent={handleAssignStudent}
                showManageLinks={isOwner}
              />
            ))}
          </div>
        )}

        <AssignStudentDialog
          mess={selectedMess}
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          onAssign={handleAssign}
        />
      </PageContainer>
    </Layout>
  )
}
