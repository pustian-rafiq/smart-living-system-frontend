import { NextRequest, NextResponse } from 'next/server'
import {
  defaultLocale,
  isValidLocale,
  LOCALE_COOKIE,
} from '@/lib/i18n/config'
import { shouldNoIndex } from '@/lib/seo/routes'

const ONE_YEAR = 60 * 60 * 24 * 365

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const current = request.cookies.get(LOCALE_COOKIE)?.value

  if (!current || !isValidLocale(current)) {
    response.cookies.set(LOCALE_COOKIE, defaultLocale, {
      path: '/',
      maxAge: ONE_YEAR,
      sameSite: 'lax',
    })
  }

  if (shouldNoIndex(request.nextUrl.pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
