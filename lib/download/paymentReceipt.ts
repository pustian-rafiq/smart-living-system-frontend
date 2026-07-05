import type { Bill } from '@/types/bill'
import type { PaymentTransaction } from '@/types/payment'
import {
  buildBillReceiptHtml,
  buildBillReceiptPdfBlob,
  downloadBill,
  getBillFilename,
} from '@/lib/download/billReceipt'
import { downloadHtml, downloadText, printHtml } from '@/lib/download/file'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatMoney(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`
}

function formatDateTime(iso?: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-GB')
  } catch {
    return iso
  }
}

export function buildPaymentReceiptHtml(
  bill: Bill,
  payment: PaymentTransaction,
  organizationName = 'Smart Living System'
): string {
  const billHtml = buildBillReceiptHtml(bill, organizationName)
  const paymentBlock = `
    <div style="margin-top:24px;padding:16px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc">
      <h2 style="margin:0 0 12px;font-size:16px">Payment confirmation</h2>
      <table style="width:100%;font-size:14px">
        <tr><td style="color:#64748b;padding:4px 0">Transaction ID</td><td style="font-weight:600;font-family:monospace">${escapeHtml(payment.transactionId)}</td></tr>
        <tr><td style="color:#64748b;padding:4px 0">Method</td><td style="font-weight:600">${escapeHtml(payment.paymentMethod)}</td></tr>
        <tr><td style="color:#64748b;padding:4px 0">Amount paid</td><td style="font-weight:600">${formatMoney(payment.amount)}</td></tr>
        <tr><td style="color:#64748b;padding:4px 0">Status</td><td style="font-weight:600;text-transform:capitalize">${escapeHtml(payment.status)}</td></tr>
        <tr><td style="color:#64748b;padding:4px 0">Paid at</td><td>${formatDateTime(payment.completedAt || payment.createdAt)}</td></tr>
        ${payment.accountNumber ? `<tr><td style="color:#64748b;padding:4px 0">Account</td><td>•••• ${escapeHtml(payment.accountNumber.slice(-4))}</td></tr>` : ''}
      </table>
    </div>`

  return billHtml.replace('</body>', `${paymentBlock}</body>`)
}

export function buildPaymentReceiptText(
  bill: Bill,
  payment: PaymentTransaction,
  organizationName = 'Smart Living System'
): string {
  return [
    organizationName,
    'PAYMENT RECEIPT',
    '========================================',
    `Transaction: ${payment.transactionId}`,
    `Method: ${payment.paymentMethod}`,
    `Amount: ${formatMoney(payment.amount)}`,
    `Status: ${payment.status}`,
    `Paid at: ${formatDateTime(payment.completedAt || payment.createdAt)}`,
    '',
    `Bill: ${bill.month} ${bill.year}`,
    `Tenant: ${bill.tenantName}`,
    `Property: ${bill.propertyName}`,
    `Total: ${formatMoney(bill.amount)}`,
    '',
    `Generated: ${new Date().toLocaleString('en-BD')}`,
  ].join('\n')
}

export function downloadPaymentReceipt(
  bill: Bill,
  payment: PaymentTransaction,
  format: 'html' | 'text' | 'pdf' | 'print' = 'html'
): void {
  const org = 'Smart Living System'
  const base = getBillFilename(bill, 'receipt').replace(/\.[^.]+$/, '')

  if (format === 'print') {
    printHtml(buildPaymentReceiptHtml(bill, payment, org), `${base}-payment`)
    return
  }

  if (format === 'pdf') {
    downloadBill({ ...bill, status: 'paid', paidDate: bill.paidDate }, {
      format: 'pdf',
      mode: 'open',
      organizationName: org,
    })
    return
  }

  if (format === 'text') {
    downloadText(
      buildPaymentReceiptText(bill, payment, org),
      `${base}-payment.txt`
    )
    return
  }

  downloadHtml(
    buildPaymentReceiptHtml(bill, payment, org),
    `${base}-payment.html`
  )
}

export function openPaymentReceiptPdf(bill: Bill, payment: PaymentTransaction) {
  if (typeof window === 'undefined') return
  const blob = buildBillReceiptPdfBlob(bill)
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
