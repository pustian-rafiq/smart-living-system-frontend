import type { OccupantType } from '@/types/mess'

/** Order shown in every type dropdown and filter. */
export const OCCUPANT_TYPES: readonly OccupantType[] = [
  'student',
  'job_holder',
  'business',
  'family',
  'other',
] as const

/** Student id / university only make sense for students. */
export function showsInstitutionFields(type: OccupantType): boolean {
  return type === 'student'
}

/** Employer or shop name, plus a designation for salaried members. */
export function showsWorkFields(type: OccupantType): boolean {
  return type === 'job_holder' || type === 'business'
}

export function isOccupantType(value: string): value is OccupantType {
  return (OCCUPANT_TYPES as readonly string[]).includes(value)
}
