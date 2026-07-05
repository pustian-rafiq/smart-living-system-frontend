/**
 * Client bundle safety checks.
 * Only `NEXT_PUBLIC_*` vars are exposed to the browser — never put secrets there.
 */

const FORBIDDEN_IN_PUBLIC_ENV = [
  'API_SECRET',
  'DATABASE_URL',
  'JWT_SECRET',
  'PRIVATE_KEY',
] as const

/** Document allowed public env keys (extend when adding NEXT_PUBLIC_* vars). */
export const PUBLIC_ENV_KEYS = ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'] as const

/**
 * Dev-only guard: warn if a forbidden key is prefixed with NEXT_PUBLIC_.
 * Call once from a client provider in development.
 */
export function assertNoSecretsInPublicEnv(): void {
  if (process.env.NODE_ENV !== 'development') return

  for (const key of FORBIDDEN_IN_PUBLIC_ENV) {
    const leaked = process.env[`NEXT_PUBLIC_${key}`]
    if (leaked) {
      console.error(
        `[security] NEXT_PUBLIC_${key} must not be set — secrets belong on the server only.`
      )
    }
  }
}
