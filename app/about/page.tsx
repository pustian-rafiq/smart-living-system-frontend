'use client'

import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, HeartHandshake, Shield, Sparkles } from 'lucide-react'

const pillars = [
  {
    icon: Building2,
    title: 'All-in-one',
    text: 'Mess, hostel, apartment, and short stays in one place — built for how Bangladesh actually rents.',
  },
  {
    icon: Shield,
    title: 'Trust by design',
    text: 'Verification, clear billing, and owner–renter tools reduce scams and WhatsApp chaos.',
  },
  {
    icon: HeartHandshake,
    title: 'Fair for both sides',
    text: 'Renters get transparency; owners get structured rent, notices, and records.',
  },
]

export default function About() {
  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="About Smart Living"
          description="We are building a modern living system for Bangladesh — from discovery and booking to rent, bills, and day-to-day communication."
        />

        <div className="prose prose-neutral dark:prose-invert mb-10 max-w-none">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Whether you are a student in a mess, a professional in a flat, or a
            traveller needing a guest house, Smart Living brings listings and
            management into one consistent experience. This web app is
            frontend-first: data is mocked like API responses so we can plug in
            a real backend without rewriting screens.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="border-border/80">
              <CardHeader>
                <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {text}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-8 w-8 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground">
                  Try the product flow
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search listings, save favourites, and explore owner or renter
                  dashboards with demo data.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/search">Explore search</Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    </Layout>
  )
}
