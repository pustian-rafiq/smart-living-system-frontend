/**
 * Printable মিল হিসাব sheet — one member, one month.
 *
 * The HTML version is the canonical layout (print dialog → Save as PDF keeps
 * Bangla text and the ৳ sign); the jsPDF version is a plain-ASCII fallback for
 * a direct download, since jsPDF's built-in fonts carry neither.
 */

import { jsPDF } from 'jspdf'
import type { MemberMealSheet } from '@/types/mess'
import { downloadHtml, printHtml, sanitizeFilename } from './file'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function mealSheetMonthLabel(sheet: MemberMealSheet): string {
  return `${MONTHS[sheet.month - 1] ?? sheet.month} ${sheet.year}`
}

export function getMealSheetFilename(sheet: MemberMealSheet, ext: string): string {
  const base = `Meal_sheet_${sheet.member.name}_${MONTHS[sheet.month - 1]}_${sheet.year}`
  return `${sanitizeFilename(base)}.${ext}`
}

function money(amount: number): string {
  return `৳${amount.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`
}

/** jsPDF's default fonts have no ৳ glyph. */
function moneyPdf(amount: number): string {
  return `BDT ${amount.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`
}

function meals(value: number): string {
  return value ? String(Number(value.toFixed(2))) : '—'
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** A4-friendly sheet: summary block, day-by-day table, cost breakdown. */
export function buildMealSheetHtml(
  sheet: MemberMealSheet,
  organizationName = 'SmartBasa'
): string {
  const { member, totals, costs } = sheet
  const monthLabel = mealSheetMonthLabel(sheet)

  const dayRows = sheet.days
    .map(day => {
      const empty = day.memberTotal === 0 && day.guestTotal === 0
      return `<tr class="${empty ? 'empty' : ''}">
        <td class="day">${day.day}</td>
        <td class="weekday">${escapeHtml(day.weekday)}</td>
        <td class="num">${meals(day.breakfast)}</td>
        <td class="num">${meals(day.lunch)}</td>
        <td class="num">${meals(day.dinner)}</td>
        <td class="num">${day.guestTotal || '—'}</td>
        <td class="num strong">${meals(day.memberTotal)}</td>
        <td class="note">${escapeHtml(day.notes || '')}</td>
      </tr>`
    })
    .join('')

  const balanceLabel = costs.due > 0 ? 'Due' : 'Credit'
  const balanceValue = costs.due > 0 ? costs.due : costs.credit

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Meal sheet — ${escapeHtml(member.name)} — ${escapeHtml(monthLabel)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", system-ui, -apple-system, "Noto Sans Bengali", sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      line-height: 1.45;
    }
    .sheet {
      max-width: 820px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 32px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand { font-size: 20px; font-weight: 700; }
    .brand span { display: block; font-size: 12px; font-weight: 500; color: #64748b; margin-top: 4px; }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      background: #e0f2fe;
      color: #075985;
    }
    .badge.closed { background: #dcfce7; color: #166534; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    .meta { color: #64748b; font-size: 13px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 20px 0;
    }
    .tile { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; }
    .label { color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
    .value { font-weight: 700; font-size: 18px; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
      border-bottom: 1px solid #cbd5e1;
      padding: 6px 4px;
    }
    td { padding: 5px 4px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    th.num, td.num { text-align: center; width: 8%; }
    td.day { width: 5%; font-weight: 600; }
    td.weekday { width: 8%; color: #64748b; }
    td.strong { font-weight: 700; }
    td.note { color: #64748b; font-size: 12px; }
    tr.empty td { color: #94a3b8; }
    tfoot td { border-top: 2px solid #0f172a; border-bottom: none; font-weight: 700; padding-top: 8px; }
    .costs { margin-top: 24px; border-top: 1px dashed #cbd5e1; padding-top: 16px; }
    .cost-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; }
    .cost-row.total { border-top: 1px solid #e2e8f0; margin-top: 6px; padding-top: 10px; font-weight: 700; font-size: 16px; }
    .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { border: none; border-radius: 0; padding: 0; max-width: none; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="brand">
        ${escapeHtml(sheet.messName)}
        <span>${escapeHtml(organizationName)} · মিল হিসাব</span>
      </div>
      <div style="text-align:right">
        <div class="badge ${sheet.status === 'closed' ? 'closed' : ''}">${sheet.status === 'closed' ? 'Month closed' : 'Month open'}</div>
        <div class="meta" style="margin-top:8px">${escapeHtml(monthLabel)}</div>
      </div>
    </div>

    <h1>Monthly meal sheet — ${escapeHtml(member.name)}</h1>
    <p class="meta">
      ${member.seatNumber ? `Seat ${escapeHtml(member.seatNumber)} · ` : ''}${escapeHtml(member.phone)}
    </p>

    <div class="grid">
      <div class="tile">
        <div class="label">Total meals</div>
        <div class="value">${meals(totals.memberMeals)}</div>
      </div>
      <div class="tile">
        <div class="label">Days with meals</div>
        <div class="value">${totals.daysWithMeals} / ${totals.daysInMonth}</div>
      </div>
      <div class="tile">
        <div class="label">Guest meals</div>
        <div class="value">${totals.guestMeals || '—'}</div>
      </div>
      <div class="tile">
        <div class="label">Meal rate</div>
        <div class="value">${money(costs.mealRate)}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Day</th>
          <th class="num">Breakfast</th>
          <th class="num">Lunch</th>
          <th class="num">Dinner</th>
          <th class="num">Guest</th>
          <th class="num">Total</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${dayRows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">Total</td>
          <td class="num">${meals(totals.breakfast)}</td>
          <td class="num">${meals(totals.lunch)}</td>
          <td class="num">${meals(totals.dinner)}</td>
          <td class="num">${totals.guestMeals || '—'}</td>
          <td class="num">${meals(totals.memberMeals)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <div class="costs">
      <div class="cost-row">
        <span>Meal cost (${meals(totals.memberMeals)} × ${money(costs.mealRate)})</span>
        <span>${money(costs.mealCost)}</span>
      </div>
      <div class="cost-row">
        <span>Guest meals${costs.guestMealPrice ? ` (${totals.guestMeals} × ${money(costs.guestMealPrice)})` : ''}</span>
        <span>${money(costs.guestCost)}</span>
      </div>
      <div class="cost-row">
        <span>Fixed share (utilities etc.)</span>
        <span>${money(costs.fixedShare)}</span>
      </div>
      <div class="cost-row">
        <span>Deposits paid</span>
        <span>− ${money(costs.deposits)}</span>
      </div>
      <div class="cost-row total">
        <span>${balanceLabel}</span>
        <span>${money(balanceValue)}</span>
      </div>
    </div>

    <div class="footer">
      <div>Generated on ${escapeHtml(new Date(sheet.generatedAt).toLocaleString('en-GB'))}</div>
      <div>Meal rate = bazaar (food) expenses ÷ total member meals. Non-food expenses are split equally.</div>
    </div>
  </div>
</body>
</html>`
}

/** ASCII-only PDF (jsPDF core fonts have no Bangla or ৳ glyphs). */
export function buildMealSheetPdfBlob(
  sheet: MemberMealSheet,
  organizationName = 'SmartBasa'
): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  const monthLabel = mealSheetMonthLabel(sheet)
  let y = 18

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text(sheet.messName, margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(`${organizationName}  |  Monthly meal sheet`, margin, y + 5)
  doc.setFontSize(11)
  doc.setTextColor(0)
  doc.text(monthLabel, pageWidth - margin, y, { align: 'right' })
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(
    sheet.status === 'closed' ? 'Month closed' : 'Month open',
    pageWidth - margin,
    y + 5,
    { align: 'right' }
  )
  doc.setTextColor(0)

  y += 11
  doc.setDrawColor(15, 23, 42)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(sheet.member.name, margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100)
  const who = [
    sheet.member.seatNumber ? `Seat ${sheet.member.seatNumber}` : '',
    sheet.member.phone,
  ]
    .filter(Boolean)
    .join('  |  ')
  doc.text(who, margin, y + 5)
  doc.setTextColor(0)
  y += 12

  // Day table
  const cols = [margin, margin + 16, margin + 34, margin + 58, margin + 82, margin + 106, margin + 130]
  const headerRow = () => {
    doc.setFillColor(248, 250, 252)
    doc.rect(margin, y - 4, pageWidth - margin * 2, 7, 'F')
    doc.setFontSize(8)
    doc.setTextColor(100)
    doc.text('DATE', cols[0] + 1, y)
    doc.text('DAY', cols[1], y)
    doc.text('BREAKFAST', cols[2], y)
    doc.text('LUNCH', cols[3], y)
    doc.text('DINNER', cols[4], y)
    doc.text('GUEST', cols[5], y)
    doc.text('TOTAL', cols[6], y)
    doc.setTextColor(0)
    y += 6
  }
  headerRow()

  doc.setFontSize(9)
  for (const day of sheet.days) {
    if (y > 275) {
      doc.addPage()
      y = 20
      headerRow()
      doc.setFontSize(9)
    }
    const dash = (value: number) => (value ? String(Number(value.toFixed(2))) : '-')
    doc.text(String(day.day), cols[0] + 1, y)
    doc.text(day.weekday, cols[1], y)
    doc.text(dash(day.breakfast), cols[2], y)
    doc.text(dash(day.lunch), cols[3], y)
    doc.text(dash(day.dinner), cols[4], y)
    doc.text(day.guestTotal ? String(day.guestTotal) : '-', cols[5], y)
    doc.setFont('helvetica', 'bold')
    doc.text(dash(day.memberTotal), cols[6], y)
    doc.setFont('helvetica', 'normal')
    y += 5.2
  }

  y += 2
  doc.setDrawColor(15, 23, 42)
  doc.line(margin, y, pageWidth - margin, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('TOTAL', cols[0] + 1, y)
  doc.text(String(Number(sheet.totals.breakfast.toFixed(2))), cols[2], y)
  doc.text(String(Number(sheet.totals.lunch.toFixed(2))), cols[3], y)
  doc.text(String(Number(sheet.totals.dinner.toFixed(2))), cols[4], y)
  doc.text(String(sheet.totals.guestMeals), cols[5], y)
  doc.text(String(Number(sheet.totals.memberMeals.toFixed(2))), cols[6], y)
  doc.setFont('helvetica', 'normal')
  y += 12

  const { costs, totals } = sheet
  const costLines: [string, string][] = [
    [
      `Meal cost (${Number(totals.memberMeals.toFixed(2))} x ${moneyPdf(costs.mealRate)})`,
      moneyPdf(costs.mealCost),
    ],
    [`Guest meals (${totals.guestMeals})`, moneyPdf(costs.guestCost)],
    ['Fixed share (utilities etc.)', moneyPdf(costs.fixedShare)],
    ['Deposits paid', `- ${moneyPdf(costs.deposits)}`],
  ]
  doc.setFontSize(10)
  for (const [label, value] of costLines) {
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(label, margin, y)
    doc.text(value, pageWidth - margin, y, { align: 'right' })
    y += 6
  }

  y += 2
  doc.setDrawColor(226, 232, 240)
  doc.line(margin, y, pageWidth - margin, y)
  y += 7
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(costs.due > 0 ? 'DUE' : 'CREDIT', margin, y)
  doc.text(
    moneyPdf(costs.due > 0 ? costs.due : costs.credit),
    pageWidth - margin,
    y,
    { align: 'right' }
  )

  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100)
  doc.text(
    `Generated: ${new Date(sheet.generatedAt).toLocaleString('en-GB')}`,
    margin,
    y
  )
  doc.text(
    'Meal rate = bazaar (food) expenses / total member meals.',
    margin,
    y + 4
  )

  return doc.output('blob')
}

export function printMealSheet(
  sheet: MemberMealSheet,
  organizationName?: string
): void {
  printHtml(
    buildMealSheetHtml(sheet, organizationName),
    getMealSheetFilename(sheet, 'sheet')
  )
}

export function downloadMealSheetHtml(
  sheet: MemberMealSheet,
  organizationName?: string
): void {
  downloadHtml(
    buildMealSheetHtml(sheet, organizationName),
    getMealSheetFilename(sheet, 'html')
  )
}

export function downloadMealSheetPdf(
  sheet: MemberMealSheet,
  organizationName?: string
): void {
  if (typeof window === 'undefined') return

  const blob = buildMealSheetPdfBlob(sheet, organizationName)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = getMealSheetFilename(sheet, 'pdf')
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
