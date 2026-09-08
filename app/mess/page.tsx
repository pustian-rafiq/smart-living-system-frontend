'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { MessOverviewCard } from '@/components/mess/MessOverviewCard'
import { MemberFormDialog } from '@/components/mess/MemberFormDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStoredRole } from '@/hooks/useStoredRole'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  assignMessStudent,
  fetchMessList,
  type MessMemberInput,
} from '@/lib/api/mess'
import { toast } from '@/lib/feedback/toast'
import type { Mess } from '@/types/mess'
import { LayoutDashboard, GraduationCap, Building2 } from 'lucide-react'
import { MessOnboardingDialog } from '@/components/onboarding'
import { ok } from '@/lib/api/http'

export default function MessOverviewPage() {
  const t = useTranslations('mess')
  const { ready, isOwner, isRenter } = useStoredRole()
  // Wait until role is known so owners never briefly (or permanently via race)
  // get the public full mess catalog on this management page.
  const loadMesses = useCallback(() => {
    if (!ready) {
      return Promise.resolve(ok([] as Mess[]))
    }
    if (isOwner) {
      return fetchMessList({ mine: true })
    }
    // Renters don't use this grid; keep empty until redirect UI renders.
    return Promise.resolve(ok([] as Mess[]))
  }, [ready, isOwner])
  const { data: messList, loading, refetch } = useMockQuery(loadMesses)
  const messes = messList ?? []
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [assignMessage, setAssignMessage] = useState<string | null>(null)
  const [localMesses, setLocalMesses] = useState<Mess[] | null>(null)
  const displayMesses = localMesses ?? messes

  const handleAssignRenter = (mess: Mess) => {
    setSelectedMess(mess)
    setIsAssignDialogOpen(true)
  }

  const handleAssign = async (data: MessMemberInput) => {
    if (!selectedMess) return false

    const result = await assignMessStudent(selectedMess.id, data)
    if (!result.ok) {
      toast.error(result.error)
      return false
    }

    // Always refresh the owner's own messes only (never the public catalog).
    const listResult = await fetchMessList({ mine: true })
    if (listResult.ok) {
      setLocalMesses(listResult.data)
    } else {
      setLocalMesses(prev => {
        const base = prev ?? messes
        return base.map(m =>
          m.id === selectedMess.id && data.seatNumber
            ? {
                ...m,
                availableSeats: Math.max(0, m.availableSeats - 1),
              }
            : m
        )
      })
    }
    void refetch()

    setAssignMessage(
      data.seatNumber
        ? t('overview.assignSuccess', {
            name: data.name,
            seat: data.seatNumber,
            mess: selectedMess.name,
          })
        : t('overview.assignSuccessNoSeat', {
            name: data.name,
            mess: selectedMess.name,
          })
    )
    return true
  }

  if (!ready || loading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState label={t('loading')} />
        </PageContainer>
      </Layout>
    )
  }

  if (isRenter) {
    return (
      <Layout>
        <PageContainer>
          <PageHeader
            title={t('overview.renterTitle')}
            description={t('overview.renterDescription')}
          />
          <Card className="max-w-lg border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5" />
                {t('studentDashboard.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('overview.renterCardDesc')}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/mess/student-dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t('overview.openStudentDashboard')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/messes">{t('overview.browsePublic')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </PageContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageContainer>
        <MessOnboardingDialog />
        <PageHeader
          title={t('overview.ownerTitle')}
          description={t('overview.ownerDescription')}
          actions={
            <Button variant="outline" asChild>
              <Link href="/mess/student-dashboard">
                <GraduationCap className="mr-2 h-4 w-4" />
                {t('overview.previewStudentView')}
              </Link>
            </Button>
          }
        />

        {assignMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
            {assignMessage}
          </div>
        )}

        {displayMesses.length === 0 ? (
          <EmptyState
            title={t('overview.emptyTitle')}
            description={t('overview.emptyDesc')}
            icon={Building2}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayMesses.map(mess => (
              <MessOverviewCard
                key={mess.id}
                mess={mess}
                onAssignRenter={handleAssignRenter}
                showManageLinks={isOwner}
              />
            ))}
          </div>
        )}

        <MemberFormDialog
          mess={selectedMess}
          open={isAssignDialogOpen}
          onOpenChange={open => {
            setIsAssignDialogOpen(open)
            if (!open) setSelectedMess(null)
          }}
          onSubmit={handleAssign}
        />
      </PageContainer>
    </Layout>
  )
}
