'use client'

import Link from 'next/link'
import { Building2, Receipt, Home } from 'lucide-react'
import { OnboardingWizard } from './OnboardingWizard'
import { Button } from '@/components/ui/button'
import { useOnboarding } from '@/hooks/useOnboarding'

export function OwnerOnboardingDialog() {
  const { shouldShow, complete } = useOnboarding('owner')

  return (
    <OnboardingWizard
      open={shouldShow}
      onOpenChange={open => {
        if (!open) complete()
      }}
      title="Welcome, property owner"
      subtitle="Set up your portfolio in a few quick steps."
      onComplete={complete}
      onSkip={complete}
      steps={[
        {
          title: 'Add your first building',
          description:
            'Create a building profile with address, floors, and basic details. This is the foundation for managing flats and renters.',
          icon: <Building2 className="h-6 w-6" />,
          content: (
            <Button asChild size="sm" variant="secondary">
              <Link href="/my-properties">Go to My Properties</Link>
            </Button>
          ),
        },
        {
          title: 'Set up flats & assign renters',
          description:
            'Add flats to each floor, track occupancy, and assign tenants. You can manage rent, deposits, and agreements from one place.',
          icon: <Home className="h-6 w-6" />,
          content: (
            <Button asChild size="sm" variant="secondary">
              <Link href="/my-properties">Manage flats</Link>
            </Button>
          ),
        },
        {
          title: 'Generate & track bills',
          description:
            'Create rent and utility bills, send reminders, and record payments. Renters can pay online when payments go live.',
          icon: <Receipt className="h-6 w-6" />,
          content: (
            <Button asChild size="sm" variant="secondary">
              <Link href="/bills">Open Bills</Link>
            </Button>
          ),
        },
      ]}
    />
  )
}
