import type { FeaturedBoostOption } from '@/types/subscription'

export const FEATURED_BOOST_OPTIONS: FeaturedBoostOption[] = [
  {
    id: 'boost-7',
    label: '7-day boost',
    durationDays: 7,
    price: 299,
    description: 'Featured badge + priority in search for one week',
  },
  {
    id: 'boost-30',
    label: '30-day boost',
    durationDays: 30,
    price: 899,
    description: 'Best value — stay on top of discovery for a month',
  },
]
