'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { MessOverviewCard } from '@/components/mess/MessOverviewCard'
import { AssignStudentDialog } from '@/components/mess/AssignStudentDialog'
import { mockMess } from '@/data/mockMess'
import type { Mess } from '@/types/mess'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UtensilsCrossed, Calendar, MessageSquare } from 'lucide-react'

export default function MessOverviewPage() {
  const [messes, setMesses] = useState(mockMess)
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  const handleAssignStudent = (mess: Mess) => {
    setSelectedMess(mess)
    setIsAssignDialogOpen(true)
  }

  const handleAssign = (data: any) => {
    // TODO: Implement actual assignment logic
    alert(`Student ${data.name} assigned to seat ${data.seatNumber} in ${selectedMess?.name}`)
    
    // Update available seats
    if (selectedMess) {
      setMesses(messes.map(m => 
        m.id === selectedMess.id 
          ? { ...m, availableSeats: m.availableSeats - 1 }
          : m
      ))
    }
    
    setIsAssignDialogOpen(false)
    setSelectedMess(null)
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Mess Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your mess facilities and student assignments
          </p>
        </div>

        {/* Quick Actions */}
        {messes.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {messes.map(mess => (
              <>
                <Link key={`meals-${mess.id}`} href={`/mess/${mess.id}/meals`}>
                  <Button variant="outline">
                    <UtensilsCrossed className="mr-2 h-4 w-4" />
                    Manage Meals - {mess.name}
                  </Button>
                </Link>
                <Link key={`attendance-${mess.id}`} href={`/mess/${mess.id}/attendance`}>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Attendance - {mess.name}
                  </Button>
                </Link>
                <Link key={`sms-${mess.id}`} href={`/mess/${mess.id}/sms`}>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    SMS - {mess.name}
                  </Button>
                </Link>
              </>
            ))}
          </div>
        )}

        {/* Messes Grid */}
        {messes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              No mess facilities yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first mess facility to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {messes.map((mess) => (
              <MessOverviewCard
                key={mess.id}
                mess={mess}
                onAssignStudent={handleAssignStudent}
              />
            ))}
          </div>
        )}

        {/* Assign Student Dialog */}
        <AssignStudentDialog
          mess={selectedMess}
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          onAssign={handleAssign}
        />
      </div>
    </Layout>
  )
}
