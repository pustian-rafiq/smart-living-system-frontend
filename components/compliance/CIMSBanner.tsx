'use client'

import { useState, useEffect } from 'react'
import { ShieldAlert, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { fetchCIMSStatus, updateCIMSStatus, type CIMSStatus } from '@/lib/api/account'

export function CIMSBanner() {
  const [status, setStatus] = useState<CIMSStatus | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetchCIMSStatus().then(res => {
      if (res.ok && res.data) setStatus(res.data)
    })
  }, [])

  if (!status || !status.required || status.cimsRegistered || status.cimsReminderDismissed || dismissed) {
    return null
  }

  const handleDismiss = async () => {
    setDismissed(true)
    await updateCIMSStatus({ cimsReminderDismissed: true })
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
      <CardContent className="flex items-start gap-3 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              CIMS Registration Required
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Dhaka Metropolitan Police (DMP) requires all landlords and tenants to register
              with CIMS (Citizen Information Management System). Register at your local Thana
              or via the CIMS app.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200"
              asChild
            >
              <a
                href="https://www.cimsdmp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-1.5 h-3 w-3" />
                CIMS Website
              </a>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-amber-700 hover:text-amber-900 dark:text-amber-300"
              onClick={handleDismiss}
            >
              Remind me later
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 text-amber-400 hover:text-amber-600"
        >
          <X className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  )
}
