'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Search,
  Building2,
  CheckCircle,
  Sparkles,
  MapPin,
} from 'lucide-react'
import { isLoggedIn } from '@/utils/auth'

const heroPhotos = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
]

export function HeroSection() {
  const router = useRouter()
  const t = useTranslations('home')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
  }, [])

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#e8f7f8,transparent_48%),radial-gradient(circle_at_80%_20%,#fce8d6,transparent_40%),linear-gradient(135deg,#fffef8,#f8fcff)] py-12 sm:py-16 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-grid-faint" />
      <div className="absolute -left-14 top-12 h-52 w-52 rounded-full bg-[#0f766e]/10 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-[#ea580c]/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
        <div className="animate-rise-up text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/75 px-4 py-2 text-sm shadow-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">{t('hero.badge')}</span>
          </div>

          <h1 className="font-display mb-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">{t('hero.titleLine1')}</span>
            <span className="block bg-gradient-to-r from-[#0f766e] via-[#0891b2] to-[#f97316] bg-clip-text text-transparent">
              {t('hero.titleLine2')}
            </span>
            <span className="block">{t('hero.titleLine3')}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0 lg:text-xl">
            {t('hero.subtitle')}
          </p>

          <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Button
              size="lg"
              className="group w-full rounded-full bg-[#0f766e] text-white hover:bg-[#115e59] sm:w-auto"
              onClick={() => router.push(loggedIn ? '/search' : '/login')}
            >
              <Search className="mr-2 h-5 w-5" />
              {loggedIn ? t('hero.browseProperties') : t('hero.getStarted')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full border-slate-300 bg-white/85 hover:bg-white sm:w-auto"
              onClick={() => router.push(loggedIn ? '/dashboard' : '/login')}
            >
              <Building2 className="mr-2 h-5 w-5" />
              {loggedIn ? t('hero.goToDashboard') : t('hero.listProperty')}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 lg:justify-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>{t('hero.trustVerified')}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>{t('hero.trustPayments')}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>{t('hero.trustSupport')}</span>
            </div>
          </div>
        </div>

        <div
          className="relative animate-rise-up"
          style={{ animationDelay: '120ms' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 h-60 overflow-hidden rounded-3xl border border-white/60 shadow-2xl sm:h-72 lg:h-80">
              <Image
                src={heroPhotos[0]}
                alt="Featured property with pool"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-2xl bg-black/55 px-3 py-2 text-sm text-white backdrop-blur-sm">
                <div className="mb-0.5 font-semibold">
                  Resort & Premium Stays
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-white/85">
                  <MapPin className="h-3.5 w-3.5" />
                  Dhaka, Chattogram, Cox&apos;s Bazar
                </div>
              </div>
            </div>

            <div className="relative h-36 overflow-hidden rounded-2xl border border-white/60 shadow-xl sm:h-44">
              <Image
                src={heroPhotos[1]}
                alt="Apartment interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-36 overflow-hidden rounded-2xl border border-white/60 shadow-xl sm:h-44">
              <Image
                src={heroPhotos[2]}
                alt="Cozy furnished room"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-lg backdrop-blur-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Live Listings
            </div>
            <div className="text-2xl font-bold text-slate-900">15,000+</div>
          </div>
        </div>
      </div>
    </section>
  )
}
