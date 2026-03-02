export type UserRole = 'renter' | 'owner' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface NavLink {
  label: string
  href: string
  roles?: UserRole[]
}
