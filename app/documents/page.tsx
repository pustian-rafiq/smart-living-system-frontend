'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AgreementCard } from '@/components/agreement/AgreementCard'
import { AgreementViewDialog } from '@/components/agreement/AgreementViewDialog'
import { AgreementUploadDialog } from '@/components/agreement/AgreementUploadDialog'
import { ChecklistItemCard } from '@/components/checklist/ChecklistItemCard'
import { ChecklistDialog } from '@/components/checklist/ChecklistDialog'
import { ChecklistViewDialog } from '@/components/checklist/ChecklistViewDialog'
import {
  getAgreementsByUserId,
  getActiveAgreement,
  addAgreement,
  updateAgreement,
} from '@/data/mockAgreements'
import {
  getChecklistsByUserId,
  getMoveInChecklist,
  getMoveOutChecklist,
  addChecklist,
} from '@/data/mockChecklists'
import { mockBuildings, mockFlats } from '@/data/mockBuildings'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { FileText, Upload, Plus, Checklist, AlertCircle } from 'lucide-react'
import type { RentalAgreement } from '@/types/agreement'
import type { Checklist as ChecklistType } from '@/types/checklist'
import { format, differenceInDays } from 'date-fns'

export default function DocumentsPage() {
  const router = useRouter()
  const role = getStoredRole()

  const [agreements, setAgreements] = useState(getAgreementsByUserId('r1'))
  const [checklists, setChecklists] = useState(getChecklistsByUserId('r1'))
  const [selectedAgreement, setSelectedAgreement] = useState<RentalAgreement | null>(null)
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistType | null>(null)
  const [isAgreementViewOpen, setIsAgreementViewOpen] = useState(false)
  const [isAgreementUploadOpen, setIsAgreementUploadOpen] = useState(false)
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false)
  const [isChecklistViewOpen, setIsChecklistViewOpen] = useState(false)
  const [editingAgreement, setEditingAgreement] = useState<RentalAgreement | null>(null)

  const activeAgreement = useMemo(() => getActiveAgreement('r1'), [])
  const moveInChecklist = useMemo(
    () => getMoveInChecklist('r1', activeAgreement?.propertyId || '', activeAgreement?.flatId),
    [activeAgreement]
  )
  const moveOutChecklist = useMemo(
    () => getMoveOutChecklist('r1', activeAgreement?.propertyId || '', activeAgreement?.flatId),
    [activeAgreement]
  )

  // Check for expiring agreements
  const expiringAgreements = useMemo(() => {
    return agreements.filter(agreement => {
      const daysUntilExpiry = differenceInDays(new Date(agreement.expiryDate), new Date())
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0 && agreement.status === 'active'
    })
  }, [agreements])

  if (role !== 'renter') {
    router.replace('/dashboard')
    return null
  }

  const handleAgreementView = (agreement: RentalAgreement) => {
    setSelectedAgreement(agreement)
    setIsAgreementViewOpen(true)
  }

  const handleAgreementDownload = (agreement: RentalAgreement) => {
    // In a real app, this would download the file
    alert(`Downloading ${agreement.documentName}...`)
  }

  const handleAgreementUpload = (data: any) => {
    if (editingAgreement) {
      const updated = updateAgreement(editingAgreement.id, {
        ...editingAgreement,
        ...data,
        documentUrl: data.documentUrl,
        documentName: data.documentName,
        documentSize: data.documentSize,
      })
      if (updated) {
        setAgreements(getAgreementsByUserId('r1'))
      }
    } else {
      const newAgreement = addAgreement({
        userId: 'r1',
        propertyId: data.propertyId,
        flatId: data.flatId,
        propertyName: mockBuildings.find(b => b.id === data.propertyId)?.name || 'Unknown Property',
        flatNumber: data.flatNumber,
        agreementType: data.agreementType,
        startDate: data.startDate,
        endDate: data.endDate,
        monthlyRent: data.monthlyRent,
        securityDeposit: data.securityDeposit,
        documentUrl: data.documentUrl,
        documentName: data.documentName,
        documentSize: data.documentSize,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'r1',
        expiryDate: data.expiryDate,
        renewalReminderDays: data.renewalReminderDays,
        status: 'active',
        terms: {
          duration: data.duration,
          noticePeriod: data.noticePeriod,
          renewalTerms: data.renewalTerms,
          specialConditions: data.specialConditions,
        },
      })
      setAgreements(getAgreementsByUserId('r1'))
    }
    setEditingAgreement(null)
  }

  const handleChecklistSubmit = (data: any) => {
    const newChecklist = addChecklist({
      userId: 'r1',
      propertyId: data.propertyId,
      propertyName: data.propertyName,
      flatId: data.flatId,
      flatNumber: data.flatNumber,
      type: data.type,
      completedAt: new Date().toISOString(),
      completedBy: 'r1',
      items: data.items,
      photos: [],
      notes: data.notes,
      totalEstimatedValue: data.items.reduce(
        (sum: number, item: any) => sum + (item.estimatedValue || 0),
        0
      ),
      totalRepairCost: data.items.reduce(
        (sum: number, item: any) => sum + (item.repairCost || 0),
        0
      ),
      securityDepositAmount: activeAgreement?.securityDeposit || 0,
      status: 'completed',
    })
    setChecklists(getChecklistsByUserId('r1'))
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">
            Manage your rental agreements and move-in/move-out checklists
          </p>
        </div>

        {/* Expiring Agreements Alert */}
        {expiringAgreements.length > 0 && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {expiringAgreements.length} agreement{expiringAgreements.length !== 1 ? 's' : ''} expiring soon
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Review and renew your agreements before they expire
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="agreements" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="agreements">
                <FileText className="h-4 w-4 mr-2" />
                Agreements
              </TabsTrigger>
              <TabsTrigger value="checklists">
                <Checklist className="h-4 w-4 mr-2" />
                Checklists
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button onClick={() => setIsAgreementUploadOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Agreement
              </Button>
            </div>
          </div>

          {/* Agreements Tab */}
          <TabsContent value="agreements" className="space-y-6">
            {agreements.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {agreements.map(agreement => (
                  <AgreementCard
                    key={agreement.id}
                    agreement={agreement}
                    onView={handleAgreementView}
                    onDownload={handleAgreementDownload}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No agreements found</p>
                  <Button onClick={() => setIsAgreementUploadOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Agreement
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Checklists Tab */}
          <TabsContent value="checklists" className="space-y-6">
            {/* Active Rental Info */}
            {activeAgreement && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Rental</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activeAgreement.propertyName}</p>
                      {activeAgreement.flatNumber && (
                        <p className="text-sm text-muted-foreground">
                          Flat {activeAgreement.flatNumber}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!moveInChecklist && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsChecklistDialogOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Move-in Checklist
                        </Button>
                      )}
                      {moveInChecklist && !moveOutChecklist && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsChecklistDialogOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Move-out Checklist
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Checklists */}
            {checklists.length > 0 ? (
              <div className="space-y-4">
                {checklists.map(checklist => (
                  <Card key={checklist.id} className="cursor-pointer hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Checklist className="h-5 w-5" />
                            {checklist.type === 'move_in' ? 'Move-in' : 'Move-out'} Checklist
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {checklist.propertyName} {checklist.flatNumber && `- Flat ${checklist.flatNumber}`}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedChecklist(checklist)
                            setIsChecklistViewOpen(true)
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Items</p>
                          <p className="text-lg font-bold">{checklist.items.length}</p>
                        </div>
                        {checklist.totalEstimatedValue && (
                          <div>
                            <p className="text-xs text-muted-foreground">Total Value</p>
                            <p className="text-lg font-bold">৳{checklist.totalEstimatedValue.toLocaleString()}</p>
                          </div>
                        )}
                        {checklist.totalRepairCost && (
                          <div>
                            <p className="text-xs text-muted-foreground">Repair Cost</p>
                            <p className="text-lg font-bold text-red-600">
                              ৳{checklist.totalRepairCost.toLocaleString()}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="text-lg font-bold capitalize">{checklist.status}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {checklist.items.slice(0, 6).map(item => (
                          <ChecklistItemCard key={item.id} item={item} showActions={false} />
                        ))}
                      </div>
                      {checklist.items.length > 6 && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          +{checklist.items.length - 6} more items
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Checklist className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No checklists found</p>
                  {activeAgreement && (
                    <Button onClick={() => setIsChecklistDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Move-in Checklist
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AgreementViewDialog
          agreement={selectedAgreement}
          open={isAgreementViewOpen}
          onOpenChange={setIsAgreementViewOpen}
          onDownload={handleAgreementDownload}
        />
        <AgreementUploadDialog
          agreement={editingAgreement}
          open={isAgreementUploadOpen}
          onOpenChange={(open) => {
            setIsAgreementUploadOpen(open)
            if (!open) setEditingAgreement(null)
          }}
          onSubmit={handleAgreementUpload}
        />
        {activeAgreement && (
          <ChecklistDialog
            checklist={null}
            propertyId={activeAgreement.propertyId}
            propertyName={activeAgreement.propertyName}
            flatId={activeAgreement.flatId}
            flatNumber={activeAgreement.flatNumber}
            open={isChecklistDialogOpen}
            onOpenChange={setIsChecklistDialogOpen}
            onSubmit={handleChecklistSubmit}
          />
        )}
        <ChecklistViewDialog
          checklist={selectedChecklist}
          open={isChecklistViewOpen}
          onOpenChange={setIsChecklistViewOpen}
        />
      </div>
    </Layout>
  )
}
