import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AppAuthProvider } from '@/components/auth'
import { FeedbackProvider } from '@/components/feedback'
import { getPageMetadata } from '@/lib/seo/get-page-metadata'
import { siteConfig } from '@/lib/seo/site'
import '@/styles/globals.css'

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('home')
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: siteConfig.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#042f2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <FeedbackProvider>
              <AppAuthProvider>{children}</AppAuthProvider>
            </FeedbackProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
