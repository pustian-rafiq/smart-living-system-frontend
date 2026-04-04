'use client'

import { useState, useMemo, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReportCard } from '@/components/report/ReportCard'
import { ReportGeneratorDialog } from '@/components/report/ReportGeneratorDialog'
import {
  getExpenseReportsByUserId,
  getTaxDocumentsByUserId,
  generateExpenseReport,
  generateTaxDocument,
} from '@/data/mockReports'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Download, Receipt } from 'lucide-react'
import type { ExpenseReport, TaxDocument } from '@/types/report'

export default function ReportsPage() {
  const router = useRouter()
  const role = getStoredRole()

  const [expenseReports, setExpenseReports] = useState(
    getExpenseReportsByUserId('r1')
  )
  const [taxDocuments, setTaxDocuments] = useState(
    getTaxDocumentsByUserId('r1')
  )
  const [isGeneratorDialogOpen, setIsGeneratorDialogOpen] = useState(false)

  const handleGenerateReport = (data: any) => {
    if (data.reportType === 'tax') {
      const taxDoc = generateTaxDocument(
        'r1',
        data.taxYear,
        data.documentType,
        data.startDate,
        data.endDate
      )
      setTaxDocuments(getTaxDocumentsByUserId('r1'))
      alert(`Tax document generated: ${taxDoc.fileName}`)
    } else {
      const report = generateExpenseReport(
        'r1',
        data.startDate,
        data.endDate,
        data.format
      )
      setExpenseReports(getExpenseReportsByUserId('r1'))
      alert(`Report generated: ${report.fileName}`)
    }
  }

  const handleDownload = (report: ExpenseReport | TaxDocument) => {
    // In a real app, this would download the file
    alert(`Downloading ${report.fileName || 'report'}...`)
  }

  useEffect(() => {
    if (role !== 'renter') {
      router.replace('/dashboard')
    }
  }, [role, router])

  if (role !== 'renter') {
    return null
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Expense Reports</h1>
            <p className="text-muted-foreground">
              Generate and download expense reports and tax documents
            </p>
          </div>
          <Button onClick={() => setIsGeneratorDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="expense" className="space-y-6">
          <TabsList>
            <TabsTrigger value="expense">
              <FileText className="h-4 w-4 mr-2" />
              Expense Reports
            </TabsTrigger>
            <TabsTrigger value="tax">
              <Receipt className="h-4 w-4 mr-2" />
              Tax Documents
            </TabsTrigger>
          </TabsList>

          {/* Expense Reports Tab */}
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
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No expense reports generated yet
                  </p>
                  <Button onClick={() => setIsGeneratorDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tax Documents Tab */}
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
              <Card>
                <CardContent className="py-12 text-center">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No tax documents generated yet
                  </p>
                  <Button onClick={() => setIsGeneratorDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Tax Document
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog */}
        <ReportGeneratorDialog
          open={isGeneratorDialogOpen}
          onOpenChange={setIsGeneratorDialogOpen}
          onSubmit={handleGenerateReport}
        />
      </div>
    </Layout>
  )
}
