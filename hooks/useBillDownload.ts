'use client'

import { useCallback, useState } from 'react'
import type { Bill } from '@/types/bill'
import {
  downloadBill,
  openBillPdf,
  printBill,
  type BillDownloadOptions,
} from '@/lib/download/billReceipt'

/**
 * Reusable bill download/print hook for any screen that shows bills.
 */
export function useBillDownload() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback((bill: Bill, action: () => void) => {
    setError(null)
    setDownloadingId(bill.id)
    try {
      action()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to download bill')
    } finally {
      window.setTimeout(() => setDownloadingId(null), 400)
    }
  }, [])

  const download = useCallback(
    (bill: Bill, options?: BillDownloadOptions) => {
      run(bill, () => downloadBill(bill, options))
    },
    [run]
  )

  const print = useCallback(
    (bill: Bill) => {
      run(bill, () => printBill(bill))
    },
    [run]
  )

  const openPdf = useCallback(
    (bill: Bill) => {
      run(bill, () => openBillPdf(bill))
    },
    [run]
  )

  return {
    download,
    print,
    openPdf,
    downloadingId,
    isDownloading: (billId: string) => downloadingId === billId,
    error,
    clearError: () => setError(null),
  }
}
