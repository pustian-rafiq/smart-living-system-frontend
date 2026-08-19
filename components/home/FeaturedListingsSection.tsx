'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockProperties } from '@/data/mockProperties'
import { formatCurrency } from '@/lib/format/locale'

const featuredItems = [...mockProperties]
  .filter(property => property.published !== false)
  .sort((a, b) => Number(b.available) - Number(a.available) || b.rent - a.rent)
  .slice(0, 5)

export function FeaturedListingsSection() {
  if (featuredItems.length === 0) {
    return null
  }

  const [hero, ...others] = featuredItems

  return (
    <section className="bg-[linear-gradient(180deg,#ffffff,#f7fbfd)] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
              Featured right now
            </p>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Handpicked homes and stays
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Carefully selected listings with strong demand, good amenities,
              and verified hosts.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-slate-300 bg-white"
          >
            <Link href="/search">
              Explore all listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Link
            href={`/listings/${hero.id}`}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-2"
          >
            <div className="relative h-72 w-full sm:h-80">
              <Image
                src={hero.images[0]}
                alt={hero.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/20">
                    {hero.type}
                  </Badge>
                  <Badge className="bg-emerald-500/85 text-white hover:bg-emerald-500/85">
                    {hero.available ? 'Available' : 'Occupied'}
                  </Badge>
                </div>
                <h3 className="text-2xl font-semibold">{hero.name}</h3>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/85">
                  <MapPin className="h-4 w-4" />
                  {hero.area}, {hero.city}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {formatCurrency(hero.rent)}/month
                </p>
              </div>
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {others.map(item => (
              <Link
                key={item.id}
                href={`/listings/${item.id}`}
                className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg lg:h-[122px]"
              >
                <div className="relative h-[122px] w-[40%] shrink-0 lg:w-[38%]">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, 20vw"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                      {item.area}, {item.city}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#0f766e]">
                      {formatCurrency(item.rent)}
                    </span>
                    <span className="text-xs text-slate-500">{item.type}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
