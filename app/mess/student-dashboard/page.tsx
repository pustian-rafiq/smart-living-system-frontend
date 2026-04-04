'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { EnhancedNoticeBoard } from '@/components/notice/EnhancedNoticeBoard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  Home,
  DollarSign,
  Calendar,
  CreditCard,
  UtensilsCrossed,
} from 'lucide-react'
import { mockStudents, mockNotices, mockMess } from '@/data/mockMess'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function StudentDashboardPage() {
  const router = useRouter()
  // Get the first student as the logged-in student (in real app, get from auth)
  const student = mockStudents[0]
  const mess = mockMess.find(m => m.id === 'm1') // In real app, get from student's messId
  const notices = mockNotices.filter(n => n.messId === mess?.id)

  if (!student || !mess) {
    return (
      <Layout>
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold">
              No student information found
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/mess')}
              className="mt-4"
            >
              Back to Mess Overview
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Student Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your mess information and updates
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Student Info & Seat Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Student Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    {student.studentId && (
                      <p className="text-sm text-muted-foreground">
                        ID: {student.studentId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{student.phone}</p>
                    </div>
                  </div>
                  {student.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{student.email}</p>
                      </div>
                    </div>
                  )}
                  {student.university && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          University
                        </p>
                        <p className="font-medium">{student.university}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {new Date(student.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Seat Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Assigned Seat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mess Info */}
                  <div className="rounded-lg border p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{mess.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {mess.address}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {mess.gender === 'male'
                          ? 'Male'
                          : mess.gender === 'female'
                            ? 'Female'
                            : 'Mixed'}
                      </Badge>
                    </div>

                    {/* Mess Image */}
                    {mess.images[0] && (
                      <div className="relative mb-3 h-32 w-full overflow-hidden rounded-md">
                        <Image
                          src={mess.images[0]}
                          alt={mess.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}

                    {/* Seat Number */}
                    <div className="flex items-center justify-between rounded-md bg-primary/5 p-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Your Seat
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {student.seatNumber || 'Not Assigned'}
                        </p>
                      </div>
                      <div className="rounded-full bg-primary/10 p-3">
                        <Home className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  {mess.facilities.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        Available Facilities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {mess.facilities.map((facility, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Monthly Fee & Notice Board */}
          <div className="space-y-6">
            {/* Monthly Fee Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Monthly Fee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Current Fee</p>
                  <p className="mt-1 text-3xl font-bold text-primary">
                    ৳{student.monthlyFee.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    per month
                  </p>
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="font-medium">5th of every month</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Late Fee</span>
                    <span className="font-medium">৳200</span>
                  </div>
                </div>

                <Button className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              </CardContent>
            </Card>

            {/* Notice Board */}
            <EnhancedNoticeBoard
              notices={notices}
              userId={student.id}
              onAcknowledge={noticeId => {
                // In real app, call API to acknowledge
                console.log('Acknowledged notice:', noticeId)
              }}
              showAcknowledgment={true}
            />

            {/* Meal Menu Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  Meal Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View today's menu and weekly schedule
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push('/mess/student-dashboard/menu')}
                >
                  <UtensilsCrossed className="mr-2 h-4 w-4" />
                  View Menu
                </Button>
              </CardContent>
            </Card>

            {/* Attendance Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View your attendance records and calendar
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    router.push('/mess/student-dashboard/attendance')
                  }
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Attendance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
