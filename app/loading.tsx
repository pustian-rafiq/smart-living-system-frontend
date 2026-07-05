import { getTranslations } from 'next-intl/server'
import { LoadingState } from '@/components/page'

export default async function Loading() {
  const t = await getTranslations('common')

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingState label={t('loading')} />
    </div>
  )
}
