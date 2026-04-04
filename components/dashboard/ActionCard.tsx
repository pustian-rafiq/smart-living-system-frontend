'use client'

import Link from 'next/link'
import { Card, CardHeader } from '@/components/ui/card'

interface QuickAction {
  title: string
  subtitle: string
  href: string
  icon: React.ReactNode
  photoToneClass: string
}

interface ActionCardProps {
  action: QuickAction
}

function Icon({
  path,
  className = 'h-6 w-6',
}: {
  path: string
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

export function ActionCard({ action }: ActionCardProps) {
  return (
    <Link href={action.href} className="block">
      <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-md md:shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary border border-primary/20 shrink-0 md:p-3">
              <div className="h-5 w-5 md:h-6 md:w-6">{action.icon}</div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold md:text-lg">
                {action.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">
                {action.subtitle}
              </p>
            </div>
            <div className="text-muted-foreground shrink-0">
              <Icon path="M9 18l6-6-6-6" className="h-5 w-5 md:h-6 md:w-6" />
            </div>
          </div>
        </CardHeader>

        {/* placeholder photo */}
        <div
          className={['h-24 sm:h-28 md:h-32', action.photoToneClass].join(' ')}
        >
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.45),rgba(255,255,255,0)_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),rgba(255,255,255,0)_60%)]" />
        </div>
      </Card>
    </Link>
  )
}
