'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader, LoadingState } from '@/components/page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  fetchRoommateBrowse,
  fetchRoommateMatches,
  fetchRoommateProfile,
  saveRoommateProfile,
} from '@/lib/api/roommates'
import { getCurrentAccountUserId } from '@/lib/api/account'
import type { RoommateProfile, RoommateProfileInput } from '@/types/living'

const emptyForm: RoommateProfileInput = {
  looking: true,
  occupation: 'student',
  sleepSchedule: 'normal',
  smoking: false,
  cooking: true,
  cleanliness: 3,
  social: 'balanced',
  petsOk: false,
  gender: '',
  genderPref: 'any',
  city: 'Dhaka',
  area: '',
  budgetMin: 5000,
  budgetMax: 12000,
  bio: '',
}

export default function RoommatesPage() {
  const t = useTranslations('living.roommates')
  const loggedIn = Boolean(getCurrentAccountUserId())
  const loadBrowse = useCallback(() => fetchRoommateBrowse(), [])
  const { data: browsing, loading: browseLoading } = useMockQuery(loadBrowse)
  const [form, setForm] = useState<RoommateProfileInput>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<RoommateProfile[]>([])

  useEffect(() => {
    if (!loggedIn) return
    fetchRoommateProfile().then(res => {
      if (res.ok && res.data) {
        const p = res.data
        setForm({
          looking: p.looking,
          occupation: p.occupation,
          sleepSchedule: p.sleepSchedule,
          smoking: p.smoking,
          cooking: p.cooking,
          cleanliness: p.cleanliness,
          social: p.social,
          petsOk: p.petsOk,
          gender: p.gender,
          genderPref: p.genderPref,
          city: p.city,
          area: p.area,
          budgetMin: p.budgetMin,
          budgetMax: p.budgetMax,
          bio: p.bio,
        })
      }
    })
  }, [loggedIn])

  const onSave = async () => {
    if (!loggedIn) {
      window.location.href = '/login'
      return
    }
    setSaving(true)
    setError(null)
    const result = await saveRoommateProfile(form)
    if (!result.ok) {
      setError(result.error)
      setSaving(false)
      return
    }
    const ranked = await fetchRoommateMatches()
    if (ranked.ok) setMatches(ranked.data.matches)
    setSaved(true)
    setSaving(false)
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader title={t('title')} description={t('description')} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault()
              void onSave()
            }}
          >
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>{t('looking')}</span>
              <Switch
                checked={form.looking}
                onCheckedChange={looking => setForm(f => ({ ...f, looking }))}
              />
            </label>

            <Field label={t('occupation')}>
              <Select
                value={form.occupation}
                onValueChange={occupation =>
                  setForm(f => ({
                    ...f,
                    occupation: occupation as RoommateProfileInput['occupation'],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">{t('student')}</SelectItem>
                  <SelectItem value="job">{t('job')}</SelectItem>
                  <SelectItem value="other">{t('other')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label={t('sleep')}>
              <Select
                value={form.sleepSchedule}
                onValueChange={sleepSchedule =>
                  setForm(f => ({
                    ...f,
                    sleepSchedule: sleepSchedule as RoommateProfileInput['sleepSchedule'],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early">{t('early')}</SelectItem>
                  <SelectItem value="normal">{t('normal')}</SelectItem>
                  <SelectItem value="late">{t('late')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label={t('social')}>
              <Select
                value={form.social}
                onValueChange={social =>
                  setForm(f => ({
                    ...f,
                    social: social as RoommateProfileInput['social'],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiet">{t('quiet')}</SelectItem>
                  <SelectItem value="balanced">{t('balanced')}</SelectItem>
                  <SelectItem value="chatty">{t('chatty')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label={t('cleanliness')}>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.cleanliness}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    cleanliness: Number(e.target.value) || 3,
                  }))
                }
              />
            </Field>

            <label className="flex items-center justify-between gap-3 text-sm">
              <span>{t('smoking')}</span>
              <Switch
                checked={form.smoking}
                onCheckedChange={smoking => setForm(f => ({ ...f, smoking }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>{t('cooking')}</span>
              <Switch
                checked={form.cooking}
                onCheckedChange={cooking => setForm(f => ({ ...f, cooking }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>{t('pets')}</span>
              <Switch
                checked={form.petsOk}
                onCheckedChange={petsOk => setForm(f => ({ ...f, petsOk }))}
              />
            </label>

            <Field label={t('gender')}>
              <Select
                value={form.gender || 'other'}
                onValueChange={gender =>
                  setForm(f => ({
                    ...f,
                    gender: gender as RoommateProfileInput['gender'],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('male')}</SelectItem>
                  <SelectItem value="female">{t('female')}</SelectItem>
                  <SelectItem value="other">{t('other')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label={t('genderPref')}>
              <Select
                value={form.genderPref}
                onValueChange={genderPref =>
                  setForm(f => ({
                    ...f,
                    genderPref: genderPref as RoommateProfileInput['genderPref'],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t('any')}</SelectItem>
                  <SelectItem value="male">{t('male')}</SelectItem>
                  <SelectItem value="female">{t('female')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label={t('city')}>
              <Input
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              />
            </Field>
            <Field label={t('area')}>
              <Input
                value={form.area}
                onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('budgetMin')}>
                <Input
                  type="number"
                  value={form.budgetMin}
                  onChange={e =>
                    setForm(f => ({ ...f, budgetMin: Number(e.target.value) || 0 }))
                  }
                />
              </Field>
              <Field label={t('budgetMax')}>
                <Input
                  type="number"
                  value={form.budgetMax}
                  onChange={e =>
                    setForm(f => ({ ...f, budgetMax: Number(e.target.value) || 0 }))
                  }
                />
              </Field>
            </div>
            <Field label={t('bio')}>
              <Textarea
                rows={4}
                placeholder={t('bioPlaceholder')}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              />
            </Field>

            {!loggedIn && (
              <p className="text-sm text-muted-foreground">{t('needLogin')}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {saved && <p className="text-sm text-primary">{t('saved')}</p>}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? t('saving') : loggedIn ? t('save') : t('login')}
            </Button>
          </form>

          <div className="space-y-8">
            {matches.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold">{t('matches')}</h2>
                <MatchList people={matches} t={t} />
              </section>
            )}
            <section>
              <h2 className="mb-4 text-lg font-semibold">{t('browse')}</h2>
              {browseLoading ? (
                <LoadingState label={t('browse')} />
              ) : !browsing?.length ? (
                <p className="text-sm text-muted-foreground">{t('noMatches')}</p>
              ) : (
                <MatchList people={browsing} t={t} />
              )}
            </section>
          </div>
        </div>
      </PageContainer>
    </Layout>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function MatchList({
  people,
  t,
}: {
  people: RoommateProfile[]
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <ul className="space-y-4">
      {people.map(person => (
        <li key={person.id} className="border-b pb-4 last:border-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold">{person.userName}</p>
            {person.compatibilityScore != null && (
              <span className="text-sm font-medium text-primary">
                {t('score', { score: person.compatibilityScore })}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {[person.area, person.city].filter(Boolean).join(', ')} · {person.occupation} ·{' '}
            {person.sleepSchedule}
          </p>
          {person.bio && (
            <p className="mt-1 text-sm text-foreground">{person.bio}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
