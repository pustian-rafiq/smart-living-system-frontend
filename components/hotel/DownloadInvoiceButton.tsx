'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, FileType, Loader2, Printer } from 'lucide-react'
import {
  downloadHotelInvoiceHtml,
  openHotelInvoicePdf,
  printHotelInvoice,
  type HotelInvoiceData,
} from '@/lib/download/hotelInvoice'

interface DownloadInvoiceButtonProps {
  data: HotelInvoiceData
  className?: string
  label?: string
}

export function DownloadInvoiceButton({
  data,
  className,
  label = 'Invoice',
}: DownloadInvoiceButtonProps) {
  const [busy, setBusy] = useState(false)
  const run = (fn: () => void) => {
    setBusy(true)
    try {
      fn()
    } finally {
      window.setTimeout(() => setBusy(false), 400)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} disabled={busy}>
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => run(() => openHotelInvoicePdf(data))}>
          <FileType className="mr-2 h-4 w-4" />
          PDF (new tab)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => run(() => downloadHotelInvoiceHtml(data))}
        >
          <FileText className="mr-2 h-4 w-4" />
          HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run(() => printHotelInvoice(data))}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
