'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Building2, Hotel, Sparkles, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/page'
import { OwnerFocusDialog } from '@/components/onboarding/OwnerFocusDialog'
import type { OwnerVertical } from '@/lib/owner-focus'

const ICONS: Record<'apartment' | 'hotel', LucideIcon> = {
  apartment: Building2,
  hotel: Hotel,
}

type VerticalLockedEmptyStateProps = {
  vertical: Extract<OwnerVertical, 'apartment' | 'hotel'>
}

/**
 * Shown when an owner opens /my-properties or /my-hotels without that
 * business enabled — CTA opens the focus picker instead of a hard redirect.
 */
export function VerticalLockedEmptyState({
  vertical,
}: VerticalLockedEmptyStateProps) {
  const t = useTranslations('dashboard.verticalLocked')
  const [focusOpen, setFocusOpen] = useState(false)
  const Icon = ICONS[vertical]
  const label = t(`${vertical}.label`)

  return (
    <>
      <EmptyState
        icon={Icon}
        title={t('title', { label })}
        description={t('description', { label: label.toLowerCase() })}
      >
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button onClick={() => setFocusOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            {t('enable', { label })}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">{t('back')}</Link>
          </Button>
        </div>
      </EmptyState>
      <OwnerFocusDialog
        mode="manage"
        open={focusOpen}
        onOpenChange={setFocusOpen}
      />
    </>
  )
}
