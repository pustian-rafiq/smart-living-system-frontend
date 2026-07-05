'use client'

import Link from 'next/link'
import { Hotel, BedDouble, CalendarDays } from 'lucide-react'
import { OnboardingWizard } from './OnboardingWizard'
import { Button } from '@/components/ui/button'
import { useOnboarding } from '@/hooks/useOnboarding'

export function HotelOnboardingDialog() {
  const { shouldShow, complete } = useOnboarding('hotel')

  return (
    <OnboardingWizard
      open={shouldShow}
      onOpenChange={open => {
        if (!open) complete()
      }}
      title="Welcome, hotel owner"
      subtitle="List your property and start accepting bookings."
      onComplete={complete}
      onSkip={complete}
      steps={[
        {
          title: 'Register your hotel',
          description:
            'Add hotel name, location, amenities, and photos. A complete profile helps guests trust and book your property.',
          icon: <Hotel className="h-6 w-6" />,
          content: (
            <Button asChild size="sm" variant="secondary">
              <Link href="/my-hotels/new">Add hotel</Link>
            </Button>
          ),
        },
        {
          title: 'Add rooms & pricing',
          description:
            'Define room types, nightly rates, and availability. Set seasonal pricing when demand changes.',
          icon: <BedDouble className="h-6 w-6" />,
          content: (
            <Button asChild size="sm" variant="secondary">
              <Link href="/my-hotels">Manage rooms</Link>
            </Button>
          ),
        },
        {
          title: 'Manage bookings & calendar',
          description:
            'Review booking requests, update statuses, and block dates on your calendar. Guests receive confirmations automatically.',
          icon: <CalendarDays className="h-6 w-6" />,
          content: (
            <Button asChild size="sm" variant="secondary">
              <Link href="/my-hotels">View bookings</Link>
            </Button>
          ),
        },
      ]}
    />
  )
}
