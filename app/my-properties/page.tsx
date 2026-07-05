'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
} from '@/components/page'
import { BuildingCard } from '@/components/building/BuildingCard'
import { AddBuildingDialog } from '@/components/building/AddBuildingDialog'
import { FreeTierLimitBanner } from '@/components/monetization'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, FileText, MessageSquare, Receipt } from 'lucide-react'
import { fetchBuildings } from '@/lib/api/buildings'
import { getDemoOwnerId } from '@/lib/api/demoUser'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchFlatLimitStatus } from '@/lib/api/subscriptions'
import type { Building } from '@/types/building'

export default function MyPropertiesPage() {
  const t = useTranslations('portfolio.myProperties')
  const tc = useTranslations('common')
  const ownerId = getDemoOwnerId()

  const loadBuildings = useCallback(() => fetchBuildings(ownerId), [ownerId])
  const { data: fetchedBuildings } = useMockQuery(loadBuildings)

  const [localBuildings, setLocalBuildings] = useState<Building[] | null>(null)
  const buildings = localBuildings ?? fetchedBuildings ?? []
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [limitDialogOpen, setLimitDialogOpen] = useState(false)

  const loadLimit = useCallback(() => fetchFlatLimitStatus(), [])
  const { data: limitStatus } = useMockQuery(loadLimit)

  const handleAddBuilding = (newBuilding: Building) => {
    setLocalBuildings(prev => [...(prev ?? fetchedBuildings ?? []), newBuilding])
    setIsAddDialogOpen(false)
  }

  const tryAddBuilding = () => {
    if (limitStatus?.atLimit) {
      setLimitDialogOpen(true)
      return
    }
    setIsAddDialogOpen(true)
  }

  return (
    <Layout userRole="owner">
      <PageContainer>
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button onClick={tryAddBuilding}>
              <Plus className="mr-2 h-4 w-4" />
              {t('addBuilding')}
            </Button>
          }
        />

        {limitStatus && (
          <div className="mb-6">
            <FreeTierLimitBanner status={limitStatus} />
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/subscription">{t('subscription')}</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/bills">
              <Receipt className="mr-2 h-4 w-4" />
              {t('bills')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/notices">
              <FileText className="mr-2 h-4 w-4" />
              {t('notices')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/complaints">
              <MessageSquare className="mr-2 h-4 w-4" />
              {t('complaints')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/my-properties/bookings">{t('bookingRequests')}</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/my-listings">{t('publicListings')}</Link>
          </Button>
        </div>

        {buildings.length === 0 ? (
          <EmptyState title={t('emptyTitle')} description={t('emptyDesc')}>
            <Button onClick={tryAddBuilding}>
              <Plus className="mr-2 h-4 w-4" />
              {t('addBuilding')}
            </Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map(building => (
              <BuildingCard key={building.id} building={building} />
            ))}
          </div>
        )}

        <AddBuildingDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddBuilding}
        />

        <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('limitTitle')}</DialogTitle>
              <DialogDescription>
                {t('limitDesc', {
                  plan: limitStatus?.planName ?? '',
                  max: limitStatus?.max ?? 0,
                  used: limitStatus?.used ?? 0,
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/subscription">{t('viewUpgrade')}</Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setLimitDialogOpen(false)}
              >
                {tc('actions.cancel')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </Layout>
  )
}
