import { apiRequest } from './client'
import type { ApiResult } from './http'
import type { UserRole } from '@/types'
import type { AdminRole } from '@/types/admin'
import { setAuthTokens, clearAuthTokens } from '@/utils/auth-tokens'

export type AuthUser = {
  id: string
  phone: string
  phoneDigits: string
  email: string
  name: string
  role: UserRole
  roleSelected: boolean
  isPhoneVerified: boolean
  hasPin: boolean
  profilePhotoUrl: string | null
  locale: string
  heartbeatSmsOptIn?: boolean
  pushOptIn?: boolean
  adminRole: AdminRole | null
  createdAt: string
  updatedAt: string
}

export type AuthSession = {
  access: string
  refresh?: string
  user: AuthUser
  needsRoleSelection: boolean
  needsPinSetup: boolean
  hasPin: boolean
  availableRoles: UserRole[]
  adminRole: AdminRole | null
}

export type OtpRequestResult = {
  phone: string
  expiresIn: number
  purpose: string
  smsDelivered?: boolean
  /** Present only when SMS fell back to console (local testing) */
  devOtp?: string
}

export type LoginStartResult = {
  next: 'pin' | 'otp'
  phone: string
  hasPin: boolean
  trustedDevice: boolean
  expiresIn?: number
  purpose?: string
  smsDelivered?: boolean
  devOtp?: string
}

function persistTokens(
  session: Pick<AuthSession, 'access' | 'refresh' | 'user'>,
) {
  setAuthTokens({
    access: session.access,
    refresh: session.refresh,
    userId: session.user.id,
  })
}

export async function startLogin(params: {
  phone: string
}): Promise<ApiResult<LoginStartResult>> {
  return apiRequest<LoginStartResult>('/auth/login/start/', {
    method: 'POST',
    auth: false,
    body: { phone: params.phone },
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

export async function loginWithPin(params: {
  phone: string
  pin: string
}): Promise<ApiResult<AuthSession>> {
  const result = await apiRequest<AuthSession>('/auth/pin/login/', {
    method: 'POST',
    auth: false,
    body: {
      phone: params.phone,
      pin: params.pin,
    },
  })
  if (result.ok) {
    persistTokens(result.data)
  }
  return result
}

export async function setPin(params: {
  pin: string
  confirmPin: string
  currentPin?: string
}): Promise<ApiResult<AuthSession>> {
  const result = await apiRequest<AuthSession>('/auth/pin/set/', {
    method: 'POST',
    body: {
      pin: params.pin,
      confirmPin: params.confirmPin,
      currentPin: params.currentPin || undefined,
    },
  })
  if (result.ok) {
    persistTokens(result.data)
  }
  return result
}

export async function refreshSession(): Promise<ApiResult<AuthSession>> {
  const result = await apiRequest<AuthSession>('/auth/token/refresh/', {
    method: 'POST',
    auth: false,
    body: {},
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

export async function updateCurrentUser(input: {
  name?: string
  email?: string
  locale?: string
  profilePhoto?: File
  heartbeatSmsOptIn?: boolean
  pushOptIn?: boolean
}): Promise<ApiResult<AuthUser>> {
  const form = new FormData()
  if (input.name !== undefined) form.append('name', input.name)
  if (input.email !== undefined) form.append('email', input.email)
  if (input.locale !== undefined) form.append('locale', input.locale)
  if (input.heartbeatSmsOptIn !== undefined) {
    form.append('heartbeatSmsOptIn', String(input.heartbeatSmsOptIn))
  }
  if (input.pushOptIn !== undefined) {
    form.append('pushOptIn', String(input.pushOptIn))
  }
  if (input.profilePhoto) form.append('profilePhoto', input.profilePhoto)
  return apiRequest<AuthUser>('/accounts/me/', {
    method: 'PATCH',
    formData: form,
  })
}

export async function logoutApi(): Promise<ApiResult<{ loggedOut: boolean }>> {
  const result = await apiRequest<{ loggedOut: boolean }>('/auth/logout/', {
    method: 'POST',
    auth: false,
    body: {},
  })
  clearAuthTokens()
  return result
}
