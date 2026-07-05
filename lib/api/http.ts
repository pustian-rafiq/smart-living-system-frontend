/**
 * Mock API transport — simulates network latency and typed results.
 * Replace calls with real fetch() + same signatures when backend is ready.
 */

export const MOCK_API_DELAY_MS = 320

export async function mockDelay(ms: number = MOCK_API_DELAY_MS): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export type ApiErrorCode =
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'INVALID'
  | 'INVALID_ACCOUNT'
  | 'GATEWAY_TODO'
  | 'UNKNOWN'

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: ApiErrorCode }

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data }
}

export function err(
  error: string,
  code: ApiErrorCode = 'UNKNOWN'
): ApiResult<never> {
  return { ok: false, error, code }
}

export function isApiError<T>(
  result: ApiResult<T>
): result is { ok: false; error: string; code?: ApiErrorCode } {
  return !result.ok
}

/** Throws on failure — use in server actions or after explicit checks. */
export function unwrapApiResult<T>(result: ApiResult<T>): T {
  if (!result.ok) throw new Error(result.error)
  return result.data
}
