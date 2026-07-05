/**
 * Generic client-side file download helpers.
 * Reuse for bills, reports, agreements, notices, etc.
 */

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120)
}

/** Trigger a browser download from a Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = sanitizeFilename(filename)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Revoke after click so the download can start
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadText(
  content: string,
  filename: string,
  mimeType = 'text/plain;charset=utf-8'
): void {
  downloadBlob(new Blob([content], { type: mimeType }), filename)
}

export function downloadHtml(html: string, filename: string): void {
  downloadText(html, filename.endsWith('.html') ? filename : `${filename}.html`, 'text/html;charset=utf-8')
}

/** Open HTML in a new window and invoke the print dialog (user can Save as PDF). */
export function printHtml(html: string, title = 'Document'): void {
  if (typeof window === 'undefined') return

  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=800,height=900')
  if (!printWindow) {
    // Popup blocked — fall back to download
    downloadHtml(html, `${title}.html`)
    return
  }

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()

  // Wait for content/styles to load before printing
  const triggerPrint = () => {
    try {
      printWindow.print()
    } catch {
      // ignore
    }
  }

  if (printWindow.document.readyState === 'complete') {
    window.setTimeout(triggerPrint, 250)
  } else {
    printWindow.onload = () => window.setTimeout(triggerPrint, 250)
  }
}
