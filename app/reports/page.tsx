'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { EmptyState, LoadingState } from '@/components/page'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReportCard } from '@/components/report/ReportCard'
import { ReportGeneratorDialog } from '@/components/report/ReportGeneratorDialog'
import {
  fetchExpenseReports,
  fetchTaxDocuments,
  createExpenseReport,
  createTaxDocument,
} from '@/lib/api/reports'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Receipt } from 'lucide-react'
import type { ExpenseReport, TaxDocument } from '@/types/report'
import { toast } from '@/lib/feedback/toast'

export default function ReportsPage() {
  const router = useRouter()
  const role = getStoredRole()
  const t = useTranslations('tools.reports')
  const tc = useTranslations('common')

  const userId = getCurrentAccountUserId()
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>([])
  const [taxDocuments, setTaxDocuments] = useState<TaxDocument[]>([])
  const [isGeneratorDialogOpen, setIsGeneratorDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadReports = useCallback(async () => {
    const [expenseRes, taxRes] = await Promise.all([
      fetchExpenseReports(userId),
      fetchTaxDocuments(userId),
    ])
    if (expenseRes.ok) setExpenseReports(expenseRes.data)
    if (taxRes.ok) setTaxDocuments(taxRes.data)
  }, [userId])

  useEffect(() => {
    if (role !== 'renter') return
    let mounted = true
    setIsLoading(true)
    loadReports().finally(() => {
      if (mounted) setIsLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [role, loadReports])

  const handleGenerateReport = async (data: {
    reportType: string
    startDate: string
    endDate: string
    format: 'pdf' | 'excel' | 'csv'
    taxYear?: number
    documentType?: 'rent_receipt' | 'expense_summary' | 'tax_certificate'
  }) => {
    if (data.reportType === 'tax') {
      const result = await createTaxDocument(
        userId,
        data.taxYear ?? new Date().getFullYear(),
        data.documentType ?? 'rent_receipt',
        data.startDate,
        data.endDate
      )
      if (result.ok) {
        await loadReports()
        toast.success(
          t('taxDocumentGenerated', { name: result.data.fileName ?? 'report' })
        )
      }
    } else {
      const result = await createExpenseReport(
        userId,
        data.startDate,
        data.endDate,
        data.format
      )
      if (result.ok) {
        await loadReports()
        toast.success(
          t('reportGenerated', { name: result.data.fileName ?? 'report' })
        )
      }
    }
  }

  const handleDownload = (report: ExpenseReport | TaxDocument) => {
    toast.info(t('downloading', { name: report.fileName || 'report' }))
  }

  useEffect(() => {
    if (role !== 'renter') {
      router.replace('/dashboard')
    }
  }, [role, router])

  if (role !== 'renter') {
    return null
  }

  if (isLoading) {
    return (
      <Layout userRole="renter">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <LoadingState label={tc('loading')} variant="skeleton" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t('expenseReportsTitle')}</h1>
            <p className="text-muted-foreground">{t('expenseReportsDesc')}</p>
          </div>
          <Button onClick={() => setIsGeneratorDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('generate')}
          </Button>
        </div>

        <Tabs defaultValue="expense" className="space-y-6">
          <TabsList>
            <TabsTrigger value="expense">
              <FileText className="h-4 w-4 mr-2" />
              {t('tabs.expense')}
            </TabsTrigger>
            <TabsTrigger value="tax">
              <Receipt className="h-4 w-4 mr-2" />
              {t('tabs.tax')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense" className="space-y-4">
            {expenseReports.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {expenseReports.map(report => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title={t('emptyTitle')}
                description={t('noExpenseReports')}
              >
                <Button onClick={() => setIsGeneratorDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('generate')}
                </Button>
              </EmptyState>
            )}
          </TabsContent>

          <TabsContent value="tax" className="space-y-4">
            {taxDocuments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {taxDocuments.map(doc => (
                  <ReportCard
                    key={doc.id}
                    taxDocument={doc}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Receipt}
                title={t('emptyTitle')}
                description={t('noTaxDocuments')}
              >
                <Button onClick={() => setIsGeneratorDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('generateTaxDocument')}
                </Button>
              </EmptyState>
            )}
          </TabsContent>
        </Tabs>

        <ReportGeneratorDialog
          open={isGeneratorDialogOpen}
          onOpenChange={setIsGeneratorDialogOpen}
          onSubmit={handleGenerateReport}
        />
      </div>
    </Layout>
  )
}
