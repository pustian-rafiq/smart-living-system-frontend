'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, Loader2, Printer, FileType } from 'lucide-react'
import type { Bill } from '@/types/bill'
import { downloadBill, openBillPdf, printBill } from '@/lib/download/billReceipt'
import { cn } from '@/lib/utils'

interface DownloadBillButtonProps {
  bill: Bill
  /** outline | default | ghost | secondary */
  variant?: 'outline' | 'default' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  /** Simple single-click: open PDF in a new tab */
  simple?: boolean
  label?: string
  organizationName?: string
}

/**
 * Reusable bill download control.
 * Use on bill cards, detail pages, dashboards, mess student bills, etc.
 */
export function DownloadBillButton({
  bill,
  variant = 'outline',
  size = 'default',
  className,
  simple = false,
  label = 'Download',
  organizationName,
}: DownloadBillButtonProps) {
  const [busy, setBusy] = useState(false)

  const run = (action: () => void) => {
    setBusy(true)
    try {
      action()
    } finally {
      window.setTimeout(() => setBusy(false), 400)
    }
  }

  if (simple) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled={busy}
        onClick={() => run(() => openBillPdf(bill, organizationName))}
      >
        {busy ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {label}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          className={cn(className)}
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() =>
            run(() => downloadBill(bill, { format: 'html', organizationName }))
          }
        >
          <FileText className="mr-2 h-4 w-4" />
          Download receipt (HTML)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            run(() => downloadBill(bill, { format: 'text', organizationName }))
          }
        >
          <FileText className="mr-2 h-4 w-4" />
          Download as text
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => run(() => openBillPdf(bill, organizationName))}
        >
          <FileType className="mr-2 h-4 w-4" />
          Download PDF (new tab)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => run(() => printBill(bill, organizationName))}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
