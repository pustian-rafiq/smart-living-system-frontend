'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader, LoadingState } from '@/components/page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchAreaSeoList } from '@/lib/api/areas'
import { MapPin } from 'lucide-react'

export default function AreasIndexPage() {
  const t = useTranslations('living.areasSeo')
  const load = useCallback(() => fetchAreaSeoList(), [])
  const { data, loading } = useMockQuery(load)

  return (
    <Layout>
      <PageContainer className="max-w-4xl">
        <PageHeader title={t('indexTitle')} description={t('indexDesc')} />
        {loading ? (
          <LoadingState label={t('loading')} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(data ?? []).map(row => (
              <Card key={row.path}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">
                      {row.area}, {row.city}
                    </p>
                    <p className="text-xs text-muted-foreground">{row.path}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={row.path}>
                      <MapPin className="mr-1 h-4 w-4" />
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
