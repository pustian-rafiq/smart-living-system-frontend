'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader, EmptyState, LoadingState } from '@/components/page'
import { MessPublicCard } from '@/components/mess/MessPublicCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDiscoverCatalog } from '@/hooks/useDiscoverCatalog'
import { Filter, UtensilsCrossed, X } from 'lucide-react'

export default function PublicMessesPage() {
  const t = useTranslations('mess.browse')
  const tc = useTranslations('common')
  const { messes, refetchAll, loading } = useDiscoverCatalog()
  const [city, setCity] = useState('')
  const [gender, setGender] = useState<'all' | 'male' | 'female' | 'mixed'>('all')
  const [openOnly, setOpenOnly] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const all = messes.data ?? []
  const cities = useMemo(
    () => [...new Set(all.map(m => m.city).filter(Boolean))].sort(),
    [all],
  )

  const filtered = useMemo(() => {
    return all.filter(mess => {
      if (city && mess.city.toLowerCase() !== city.toLowerCase()) return false
      if (gender !== 'all' && mess.gender !== gender) return false
      if (openOnly && mess.availableSeats <= 0) return false
      return true
    })
  }, [all, city, gender, openOnly])

  const reset = () => {
    setCity('')
    setGender('all')
    setOpenOnly(true)
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button variant="outline" onClick={() => refetchAll()} disabled={loading}>
              {tc('refresh')}
            </Button>
          }
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className={`lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{tc('filters')}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>{t('filters.city')}</Label>
                  <Select
                    value={city || 'all'}
                    onValueChange={value => setCity(value === 'all' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('filters.allCities')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.allCities')}</SelectItem>
                      {cities.map(item => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('filters.gender')}</Label>
                  <Select
                    value={gender}
                    onValueChange={value =>
                      setGender(value as 'all' | 'male' | 'female' | 'mixed')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.allGenders')}</SelectItem>
                      <SelectItem value="male">{t('filters.male')}</SelectItem>
                      <SelectItem value="female">{t('filters.female')}</SelectItem>
                      <SelectItem value="mixed">{t('filters.mixed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="open-only">{t('filters.openSeats')}</Label>
                  <Input
                    id="open-only"
                    type="checkbox"
                    checked={openOnly}
                    onChange={e => setOpenOnly(e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
                <Button variant="outline" className="w-full" onClick={reset}>
                  {tc('resetFilters')}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <p className="text-sm text-muted-foreground">
                {t('found', { count: filtered.length })}
              </p>
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                <Filter className="mr-2 h-4 w-4" />
                {tc('filters')}
              </Button>
            </div>
            <p className="mb-4 hidden text-sm text-muted-foreground lg:block">
              {t('found', { count: filtered.length })}
            </p>

            {messes.loading ? (
              <LoadingState label={t('loading')} variant="skeleton" />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={UtensilsCrossed}
                title={t('emptyTitle')}
                description={t('emptyDesc')}
              >
                <Button variant="outline" onClick={reset}>
                  {tc('resetFilters')}
                </Button>
              </EmptyState>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map(mess => (
                  <MessPublicCard key={mess.id} mess={mess} />
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  )
}
