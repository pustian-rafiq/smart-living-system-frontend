import { apiRequest } from './client'
import type { ApiResult } from './http'
import type { UserRole } from '@/types'
import type { AdminRole } from '@/types/admin'
import {
  setAuthTokens,
  clearAuthTokens,
  getRefreshToken,
} from '@/utils/auth-tokens'

export type AuthUser = {
  id: string
  phone: string
  phoneDigits: string
  email: string
  name: string
  role: UserRole
  roleSelected: boolean
  isPhoneVerified: boolean
  profilePhotoUrl: string | null
  locale: string
  adminRole: AdminRole | null
  createdAt: string
  updatedAt: string
}

export type AuthSession = {
  access: string
  refresh: string
  user: AuthUser
  needsRoleSelection: boolean
  availableRoles: UserRole[]
  adminRole: AdminRole | null
}

export type OtpRequestResult = {
  phone: string
  expiresIn: number
  purpose: string
  /** Present only when API DEBUG=true */
  devOtp?: string
}

function persistTokens(session: Pick<AuthSession, 'access' | 'refresh' | 'user'>) {
  setAuthTokens({
    access: session.access,
    refresh: session.refresh,
    userId: session.user.id,
  })
}

export async function requestOtp(params: {
  phone: string
  purpose?: 'login' | 'recover'
}): Promise<ApiResult<OtpRequestResult>> {
  return apiRequest<OtpRequestResult>('/auth/otp/request/', {
    method: 'POST',
    auth: false,
    body: {
      phone: params.phone,
      purpose: params.purpose ?? 'login',
    },
  })
}

export async function verifyOtp(params: {
  phone: string
  otp: string
  purpose?: 'login' | 'recover'
}): Promise<ApiResult<AuthSession>> {
  const result = await apiRequest<AuthSession>('/auth/otp/verify/', {
    method: 'POST',
    auth: false,
    body: {
      phone: params.phone,
      otp: params.otp,
      purpose: params.purpose ?? 'login',
    },
  })
  if (result.ok) {
    persistTokens(result.data)
  }
  return result
}

export async function selectRole(
  role: UserRole,
): Promise<ApiResult<AuthSession>> {
  const result = await apiRequest<AuthSession>('/auth/role/select/', {
    method: 'POST',
    body: { role },
  })
  if (result.ok) {
    persistTokens(result.data)
  }
  return result
}

export async function fetchCurrentUser(): Promise<ApiResult<AuthUser>> {
  return apiRequest<AuthUser>('/accounts/me/')
}

export async function logoutApi(): Promise<ApiResult<{ logged_out: boolean }>> {
  const refresh = getRefreshToken()
  const result = refresh
    ? await apiRequest<{ logged_out: boolean }>('/auth/logout/', {
        method: 'POST',
        body: { refresh },
      })
    : { ok: true as const, data: { logged_out: true } }
  clearAuthTokens()
  return result
}
