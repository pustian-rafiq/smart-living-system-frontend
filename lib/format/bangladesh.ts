import type { MealDay } from '@/types/meal'
import { endOfWeek, startOfWeek } from 'date-fns'

/**
 * Bangladesh cultural calendar defaults.
 * Official weekend is Fri–Sat; weekly schedules/calendars start on Saturday.
 */
export const BD_WEEK_STARTS_ON = 6 as const // Saturday (date-fns / JS getDay)

export const BD_TIME_ZONE = 'Asia/Dhaka'

/** Day order for weekly menus and calendar headers (Sat → Fri). */
export const BD_WEEK_DAYS: {
  value: MealDay
  label: string
  short: string
}[] = [
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
]

export const BD_WEEK_DAY_KEYS = BD_WEEK_DAYS.map(d => d.value)

/** Leading empty cells before the 1st of the month in a Sat-start grid. */
export function bdMonthStartPad(date: Date): number {
  return (date.getDay() + 1) % 7
}

export function bdStartOfWeek(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: BD_WEEK_STARTS_ON })
}

export function bdEndOfWeek(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: BD_WEEK_STARTS_ON })
}
