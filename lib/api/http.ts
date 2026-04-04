/**
 * Mock API transport — simulates network latency and typed results.
 * Replace calls with real fetch() + same signatures when backend is ready.
 */

export const MOCK_API_DELAY_MS = 320

export async function mockDelay(ms: number = MOCK_API_DELAY_MS): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string }

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data }
}

export function err(error: string, code?: string): ApiResult<never> {
  return { ok: false, error, code }
}
