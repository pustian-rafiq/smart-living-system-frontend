import { mockDelay, ok, err, type ApiResult } from './http'
import { getDemoOwnerId, getDemoRenterId } from './demoUser'
import { getStoredRole } from '@/utils/auth'

export async function requestPhoneChange(params: {
  newPhone: string
  otp: string
}): Promise<ApiResult<{ phone: string }>> {
  await mockDelay(400)
  if (params.otp !== '123456') {
    return err('Invalid OTP. Demo code is 123456')
  }
  if (params.newPhone.replace(/\D/g, '').length !== 13) {
    return err('Enter a valid +880 phone number')
  }
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('loginPhone', params.newPhone.replace(/\D/g, ''))
  }
  return ok({ phone: params.newPhone })
}

export async function recoverAccount(params: {
  phone: string
  otp: string
}): Promise<ApiResult<{ recovered: true }>> {
  await mockDelay(500)
  if (params.otp !== '123456') {
    return err('Invalid OTP. Demo code is 123456')
  }
  const normalized = params.phone.replace(/\D/g, '')
  if (normalized.length !== 13) {
    return err('Enter a valid Bangladesh phone number')
  }
  // Demo: any valid phone can "recover" — production would verify account exists
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('loginPhone', normalized)
    sessionStorage.setItem('otpVerified', 'true')
    sessionStorage.setItem('isLoggedIn', 'true')
    const role = sessionStorage.getItem('userRole') || 'renter'
    sessionStorage.setItem('userRole', role)
  }
  return ok({ recovered: true })
}

export function getCurrentAccountUserId(): string {
  const role = getStoredRole()
  if (role === 'owner') return getDemoOwnerId()
  if (role === 'admin') return 'admin1'
  return getDemoRenterId()
}
