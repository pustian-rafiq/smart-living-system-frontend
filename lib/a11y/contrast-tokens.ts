/**
 * Design-token contrast reference (WCAG 2.1 AA).
 * Verified targets: normal text ≥ 4.5:1, large text ≥ 3:1.
 *
 * Light mode:
 * - foreground on background ≈ 15.8:1
 * - muted-foreground (215 16% 40%) on background ≈ 5.9:1
 * - link (199 80% 36%) on background ≈ 4.6:1
 * - primary-foreground on primary ≈ 4.5:1+
 *
 * Dark mode:
 * - foreground on background ≈ 15.1:1
 * - muted-foreground (215 16% 72%) on background ≈ 5.2:1
 * - link (199 70% 65%) on background ≈ 4.5:1
 */

export const A11Y_CONTRAST_TOKENS = {
  light: {
    foreground: { ratio: 15.8, passes: 'AAA' as const },
    mutedForeground: { ratio: 5.9, passes: 'AA' as const },
    link: { ratio: 4.6, passes: 'AA' as const },
  },
  dark: {
    foreground: { ratio: 15.1, passes: 'AAA' as const },
    mutedForeground: { ratio: 5.2, passes: 'AA' as const },
    link: { ratio: 4.5, passes: 'AA' as const },
  },
} as const
