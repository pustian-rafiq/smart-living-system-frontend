'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ServerSearchInput } from '@/components/data/ServerSearchInput'
import { PaginationBar } from '@/components/data/PaginationBar'
import { useServerPagedList } from '@/hooks/useServerPagedList'
import {
  adjustAdminSMSCredits,
  createAdminSMSPackage,
  deactivateAdminSMSPackage,
  fetchAdminSMSMessages,
  fetchAdminSMSOverview,
  fetchAdminSMSPackages,
  fetchAdminSMSWalletDetail,
  fetchAdminSMSWallets,
  updateAdminSMSPackage,
  type AdminOwnerSMSWallet,
  type AdminSMSOverview,
  type AdminSMSPackage,
} from '@/lib/api/admin'
import { hasAdminPermission } from '@/lib/admin/permissions'
import { getStoredAdminRole } from '@/utils/auth'
import { toast } from '@/lib/feedback/toast'
import type { SMSCreditLedgerEntry, SMSMessage } from '@/types/sms'
import { Plus, Smartphone } from 'lucide-react'

const emptyPackageForm = {
  packageKey: '',
  label: '',
  credits: 50,
  priceBdt: 25,
  description: '',
  sortOrder: 0,
  isActive: true,
}

export default function AdminSMSPage() {
  const adminRole = getStoredAdminRole()
  const canManage = hasAdminPermission(adminRole, 'sms.manage')

  const [overview, setOverview] = useState<AdminSMSOverview | null>(null)
  const [packages, setPackages] = useState<AdminSMSPackage[]>([])
  const [pkgDialogOpen, setPkgDialogOpen] = useState(false)
  const [editingPkg, setEditingPkg] = useState<AdminSMSPackage | null>(null)
  const [pkgForm, setPkgForm] = useState(emptyPackageForm)
  const [savingPkg, setSavingPkg] = useState(false)

  const [detailOwner, setDetailOwner] = useState<AdminOwnerSMSWallet | null>(
    null,
  )
  const [detailLedger, setDetailLedger] = useState<SMSCreditLedgerEntry[]>([])
  const [detailMessages, setDetailMessages] = useState<SMSMessage[]>([])
  const [adjustCredits, setAdjustCredits] = useState('10')
  const [adjustNote, setAdjustNote] = useState('')
  const [adjusting, setAdjusting] = useState(false)

  const refreshOverviewAndPackages = useCallback(async () => {
    const [ov, pkgs] = await Promise.all([
      fetchAdminSMSOverview(),
      fetchAdminSMSPackages(true),
    ])
    if (ov.ok) setOverview(ov.data)
    if (pkgs.ok) setPackages(pkgs.data)
  }, [])

  useEffect(() => {
    void refreshOverviewAndPackages()
  }, [refreshOverviewAndPackages])

  const walletFetcher = useCallback(
    (params: {
      page: number
      pageSize: number
      search: string
      filters: Record<string, string>
    }) =>
      fetchAdminSMSWallets({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
      }),
    [],
  )

  const wallets = useServerPagedList<AdminOwnerSMSWallet>({
    fetcher: walletFetcher,
    pageSize: 20,
    minSearchChars: 3,
  })

  const messageFetcher = useCallback(
    (params: {
      page: number
      pageSize: number
      search: string
      filters: Record<string, string>
    }) =>
      fetchAdminSMSMessages({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
      }),
    [],
  )

  const messages = useServerPagedList<SMSMessage>({
    fetcher: messageFetcher,
    pageSize: 20,
    minSearchChars: 3,
  })

  const openCreatePackage = () => {
    setEditingPkg(null)
    setPkgForm(emptyPackageForm)
    setPkgDialogOpen(true)
  }

  const openEditPackage = (pkg: AdminSMSPackage) => {
    setEditingPkg(pkg)
    setPkgForm({
      packageKey: pkg.packageKey,
      label: pkg.label,
      credits: pkg.credits,
      priceBdt: pkg.priceBdt,
      description: pkg.description,
      sortOrder: pkg.sortOrder,
      isActive: pkg.isActive,
    })
    setPkgDialogOpen(true)
  }

  const savePackage = async () => {
    if (!canManage) return
    setSavingPkg(true)
    try {
      if (editingPkg) {
        const result = await updateAdminSMSPackage(editingPkg.id, {
          packageKey: pkgForm.packageKey,
          label: pkgForm.label,
          credits: Number(pkgForm.credits),
          priceBdt: Number(pkgForm.priceBdt),
          description: pkgForm.description,
          sortOrder: Number(pkgForm.sortOrder),
          isActive: pkgForm.isActive,
        })
        if (!result.ok) {
          toast.error(result.error || 'Could not update package')
          return
        }
        toast.success('Package updated')
      } else {
        const result = await createAdminSMSPackage({
          packageKey: pkgForm.packageKey,
          label: pkgForm.label,
          credits: Number(pkgForm.credits),
          priceBdt: Number(pkgForm.priceBdt),
          description: pkgForm.description,
          sortOrder: Number(pkgForm.sortOrder),
          isActive: pkgForm.isActive,
        })
        if (!result.ok) {
          toast.error(result.error || 'Could not create package')
          return
        }
        toast.success('Package created')
      }
      setPkgDialogOpen(false)
      await refreshOverviewAndPackages()
    } finally {
      setSavingPkg(false)
    }
  }

  const deactivatePackage = async (pkg: AdminSMSPackage) => {
    if (!canManage) return
    const result = await deactivateAdminSMSPackage(pkg.id)
    if (!result.ok) {
      toast.error(result.error || 'Could not deactivate package')
      return
    }
    toast.success('Package deactivated')
    await refreshOverviewAndPackages()
  }

  const openOwnerDetail = async (row: AdminOwnerSMSWallet) => {
    const result = await fetchAdminSMSWalletDetail(row.ownerId)
    if (!result.ok) {
      toast.error(result.error || 'Could not load owner SMS detail')
      return
    }
    setDetailOwner(result.data.wallet)
    setDetailLedger(result.data.ledger)
    setDetailMessages(result.data.messages)
  }

  const submitAdjust = async () => {
    if (!canManage || !detailOwner) return
    const credits = Number(adjustCredits)
    if (!Number.isFinite(credits) || credits === 0) {
      toast.error('Enter a non-zero credit amount')
      return
    }
    setAdjusting(true)
    try {
      const result = await adjustAdminSMSCredits(
        detailOwner.ownerId,
        credits,
        adjustNote,
      )
      if (!result.ok) {
        toast.error(result.error || 'Adjustment failed')
        return
      }
      setDetailOwner(result.data.wallet)
      setDetailLedger(result.data.ledger)
      toast.success('Credits adjusted')
      wallets.refetch()
      await refreshOverviewAndPackages()
    } finally {
      setAdjusting(false)
    }
  }

  const overviewCards = useMemo(() => {
    if (!overview) return []
    return [
      { label: 'Owner wallets', value: overview.ownerWallets },
      { label: 'Credits available', value: overview.totalBalance },
      { label: 'Credits used', value: overview.totalUsed },
      { label: 'SMS sent (ok)', value: overview.smsSuccessful },
      { label: 'SMS failed', value: overview.smsFailed },
      {
        label: 'Platform cost',
        value: `৳${overview.smsCostBdt.toFixed(2)}`,
      },
    ]
  }, [overview])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Smartphone className="h-6 w-6" />
            Platform SMS
          </h1>
          <p className="text-sm text-muted-foreground">
            System BulkSMSBD packs, owner credit wallets, and full send history.
            {overview?.gateway?.label
              ? ` Gateway: ${overview.gateway.label}.`
              : ''}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {overviewCards.map(card => (
            <Card key={card.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="wallets" className="space-y-4">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="wallets">Owner wallets</TabsTrigger>
            <TabsTrigger value="messages">Sent SMS</TabsTrigger>
            <TabsTrigger value="packages">SMS packs</TabsTrigger>
          </TabsList>

          <TabsContent value="wallets" className="space-y-4">
            <ServerSearchInput
              value={wallets.searchInput}
              onChange={wallets.setSearchInput}
              pending={wallets.searchPending}
              placeholder="Search owner name or phone…"
            />
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2">Owner</th>
                    <th className="px-3 py-2">Available</th>
                    <th className="px-3 py-2">Used</th>
                    <th className="px-3 py-2">Granted / Bought</th>
                    <th className="px-3 py-2">Sent</th>
                    <th className="px-3 py-2">Plan</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {wallets.items.map(row => (
                    <tr key={row.ownerId} className="border-t">
                      <td className="px-3 py-2">
                        <div className="font-medium">
                          {row.ownerName || '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {row.ownerPhone}
                        </div>
                      </td>
                      <td className="px-3 py-2 font-semibold text-green-700">
                        {row.available}
                      </td>
                      <td className="px-3 py-2 font-semibold text-red-700">
                        {row.occupied}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {row.lifetimeGranted} / {row.lifetimePurchased}
                      </td>
                      <td className="px-3 py-2">
                        {row.smsSuccessful}
                        <span className="text-muted-foreground">
                          {' '}
                          ({row.smsBatches} batches)
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="outline">{row.planName}</Badge>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void openOwnerDetail(row)}
                        >
                          History
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {!wallets.loading && wallets.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-3 py-8 text-center text-muted-foreground"
                      >
                        No owner SMS wallets yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <PaginationBar
              page={wallets.page}
              totalPages={wallets.totalPages}
              count={wallets.count}
              pageSize={wallets.pageSize}
              loading={wallets.loading}
              onPageChange={wallets.setPage}
              onPageSizeChange={wallets.setPageSize}
            />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <ServerSearchInput
              value={messages.searchInput}
              onChange={messages.setSearchInput}
              pending={messages.searchPending}
              placeholder="Search content, mess, or owner…"
            />
            <div className="space-y-3">
              {messages.items.map(msg => (
                <Card key={msg.id}>
                  <CardContent className="space-y-2 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{msg.status}</Badge>
                      {msg.messName && (
                        <Badge variant="secondary">{msg.messName}</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {msg.sentByName || msg.sentByPhone || msg.sentBy}
                        {msg.sentAt
                          ? ` · ${format(new Date(msg.sentAt), 'dd/MM/yyyy HH:mm')}`
                          : ''}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{msg.content}</p>
                    <p className="text-xs text-muted-foreground">
                      ok {msg.successful} / fail {msg.failed} / total{' '}
                      {msg.totalRecipients}
                      {typeof msg.cost === 'number'
                        ? ` · ৳${msg.cost.toFixed(2)}`
                        : ''}
                      {msg.gateway ? ` · ${msg.gateway}` : ''}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {!messages.loading && messages.items.length === 0 && (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    No SMS batches sent yet.
                  </CardContent>
                </Card>
              )}
            </div>
            <PaginationBar
              page={messages.page}
              totalPages={messages.totalPages}
              count={messages.count}
              pageSize={messages.pageSize}
              loading={messages.loading}
              onPageChange={messages.setPage}
              onPageSizeChange={messages.setPageSize}
            />
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Packs shown to owners when buying extra SMS credits.
              </p>
              {canManage && (
                <Button onClick={openCreatePackage}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add pack
                </Button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {packages.map(pkg => (
                <Card key={pkg.id} className={!pkg.isActive ? 'opacity-60' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between gap-2 text-base">
                      <span>{pkg.label}</span>
                      <Badge variant={pkg.isActive ? 'default' : 'outline'}>
                        {pkg.isActive ? 'Active' : 'Off'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>{pkg.credits}</strong> credits · ৳{pkg.priceBdt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      key: {pkg.packageKey}
                    </p>
                    {pkg.description && (
                      <p className="text-muted-foreground">{pkg.description}</p>
                    )}
                    {canManage && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditPackage(pkg)}
                        >
                          Edit
                        </Button>
                        {pkg.isActive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => void deactivatePackage(pkg)}
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={pkgDialogOpen} onOpenChange={setPkgDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPkg ? 'Edit SMS pack' : 'New SMS pack'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1">
              <Label>Package key</Label>
              <Input
                value={pkgForm.packageKey}
                onChange={e =>
                  setPkgForm(f => ({ ...f, packageKey: e.target.value }))
                }
                placeholder="sms-100"
              />
            </div>
            <div className="space-y-1">
              <Label>Label</Label>
              <Input
                value={pkgForm.label}
                onChange={e =>
                  setPkgForm(f => ({ ...f, label: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Credits</Label>
                <Input
                  type="number"
                  value={pkgForm.credits}
                  onChange={e =>
                    setPkgForm(f => ({
                      ...f,
                      credits: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Price (৳)</Label>
                <Input
                  type="number"
                  value={pkgForm.priceBdt}
                  onChange={e =>
                    setPkgForm(f => ({
                      ...f,
                      priceBdt: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input
                value={pkgForm.description}
                onChange={e =>
                  setPkgForm(f => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={pkgForm.sortOrder}
                  onChange={e =>
                    setPkgForm(f => ({
                      ...f,
                      sortOrder: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <input
                  id="pkg-active"
                  type="checkbox"
                  checked={pkgForm.isActive}
                  onChange={e =>
                    setPkgForm(f => ({ ...f, isActive: e.target.checked }))
                  }
                />
                <Label htmlFor="pkg-active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPkgDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={savingPkg} onClick={() => void savePackage()}>
              {savingPkg ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!detailOwner}
        onOpenChange={open => {
          if (!open) setDetailOwner(null)
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {detailOwner?.ownerName || detailOwner?.ownerPhone} — SMS history
            </DialogTitle>
          </DialogHeader>
          {detailOwner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div>
                  Available:{' '}
                  <strong className="text-green-700">
                    {detailOwner.available}
                  </strong>
                </div>
                <div>
                  Used:{' '}
                  <strong className="text-red-700">
                    {detailOwner.occupied}
                  </strong>
                </div>
                <div>
                  Granted: <strong>{detailOwner.lifetimeGranted}</strong>
                </div>
                <div>
                  Purchased: <strong>{detailOwner.lifetimePurchased}</strong>
                </div>
              </div>

              {canManage && (
                <div className="rounded-lg border p-3 space-y-2">
                  <Label>Adjust credits (+ grant / − debit)</Label>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      className="w-28"
                      value={adjustCredits}
                      onChange={e => setAdjustCredits(e.target.value)}
                    />
                    <Input
                      className="min-w-[160px] flex-1"
                      placeholder="Note"
                      value={adjustNote}
                      onChange={e => setAdjustNote(e.target.value)}
                    />
                    <Button
                      disabled={adjusting}
                      onClick={() => void submitAdjust()}
                    >
                      {adjusting ? 'Saving…' : 'Apply'}
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 font-semibold">Credit ledger</h3>
                <div className="max-h-48 divide-y overflow-y-auto rounded border">
                  {detailLedger.map(entry => (
                    <div
                      key={entry.id}
                      className="flex justify-between gap-2 px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="capitalize">
                          {entry.entryType.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.note} ·{' '}
                          {format(
                            new Date(entry.createdAt),
                            'dd/MM/yyyy HH:mm',
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={
                            entry.credits >= 0
                              ? 'font-semibold text-green-700'
                              : 'font-semibold text-red-700'
                          }
                        >
                          {entry.credits >= 0 ? '+' : ''}
                          {entry.credits}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          bal {entry.balanceAfter}
                        </p>
                      </div>
                    </div>
                  ))}
                  {detailLedger.length === 0 && (
                    <p className="px-3 py-4 text-sm text-muted-foreground">
                      No ledger entries.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Sent batches</h3>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {detailMessages.map(msg => (
                    <div
                      key={msg.id}
                      className="rounded border px-3 py-2 text-sm"
                    >
                      <p className="line-clamp-2">{msg.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {msg.messName || '—'} · ok {msg.successful} / fail{' '}
                        {msg.failed}
                        {msg.sentAt
                          ? ` · ${format(new Date(msg.sentAt), 'dd/MM/yyyy HH:mm')}`
                          : ''}
                      </p>
                    </div>
                  ))}
                  {detailMessages.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No SMS batches for this owner.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
