import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AppAuthProvider } from '@/components/auth'
import { FeedbackProvider } from '@/components/feedback'
import { ServiceWorkerRegistration } from '@/components/pwa'
import { getPageMetadata } from '@/lib/seo/get-page-metadata'
import { siteConfig } from '@/lib/seo/site'
import '@/styles/globals.css'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

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
      <body className={`${sans.variable} ${display.variable}`}>
        <ServiceWorkerRegistration />
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
