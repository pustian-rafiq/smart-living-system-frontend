'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader, LoadingState } from '@/components/page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchUniversities } from '@/lib/api/universities'
import { GraduationCap } from 'lucide-react'

export default function UniversitiesIndexPage() {
  const t = useTranslations('living.university')
  const load = useCallback(() => fetchUniversities(), [])
  const { data, loading } = useMockQuery(load)

  return (
    <Layout>
      <PageContainer className="max-w-4xl">
        <PageHeader title={t('indexTitle')} description={t('indexDesc')} />
        {loading ? (
          <LoadingState label={t('loading')} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(data ?? []).map(uni => (
              <Card key={uni.slug}>
                <CardContent className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{uni.name}</p>
                    <p className="text-sm text-muted-foreground">{uni.fullName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {uni.city} · {uni.areas.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/university/${uni.slug}/mess`}>
                      <GraduationCap className="mr-1 h-4 w-4" />
                      {t('viewMess')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </Layout>
  )
}
