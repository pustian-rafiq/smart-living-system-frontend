import { apiRequest } from './client'
import type { ApiResult } from './http'

export type PushClientConfig = {
  enabled: boolean
  configured: boolean
  publicKey: string
  heartbeatEnabled: boolean
}

export async function fetchPushConfig(): Promise<ApiResult<PushClientConfig>> {
  return apiRequest('/push/config/', { auth: false })
}

export async function savePushSubscription(subscription: {
  endpoint: string
  keys: { p256dh: string; auth: string }
}): Promise<ApiResult<{ id: string; endpoint: string }>> {
  return apiRequest('/push/subscribe/', {
    method: 'POST',
    body: subscription,
  })
}

export async function deletePushSubscription(
  endpoint: string,
): Promise<ApiResult<{ removed: boolean }>> {
  return apiRequest('/push/subscribe/', {
    method: 'DELETE',
    body: { endpoint },
  })
}

export async function sendTestPush(): Promise<
  ApiResult<{ attempted: number; sent: number; failed: number }>
> {
  return apiRequest('/push/test/', { method: 'POST' })
}
