import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default async function NotFound() {
  const t = await getTranslations('common.errors')
  const tc = await getTranslations('common')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <p className="text-6xl font-bold text-primary/20">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {t('notFoundTitle')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('notFoundDesc')}</p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t('goHome')}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              {t('browseListings')}
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          {tc('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  )
}
