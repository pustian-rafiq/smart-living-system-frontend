import type {
  Bill,
  BillTemplate,
  BillGenerationRule,
  MeterReading,
} from '@/types/bill'
import type { Building, Flat, Renter } from '@/types/building'
import type { Mess } from '@/types/mess'
import {
  mockBills,
  getBillsByTenantId,
  getBillById,
  markBillPaid,
} from '@/data/mockBills'
import {
  mockBillTemplates,
  mockBillGenerationRules,
  mockMeterReadings,
  getMeterReading,
  getPreviousMeterReading,
  getTemplateById,
  getRuleById,
  getActiveTemplates,
  getTemplatesByProperty,
  getActiveRules,
} from '@/data/mockBillTemplates'
import { mockBuildings, mockFlats, mockRenters } from '@/data/mockBuildings'
import { mockMess } from '@/data/mockMess'
import { addScheduledPayment } from '@/data/mockPayments'
import type { ScheduledPayment } from '@/types/payment'
import type { BillsBoardResponse } from './contracts'
import { getDemoOwnerId, getDemoTenantId } from './demoUser'
import { mockDelay, ok, err, type ApiResult } from './http'

export async function fetchBillsBoard(): Promise<ApiResult<BillsBoardResponse>> {
  await mockDelay()
  return ok({
    bills: [...mockBills],
    templates: [...mockBillTemplates],
    rules: [...mockBillGenerationRules],
    meterReadings: [...mockMeterReadings],
    buildings: [...mockBuildings],
    flats: [...mockFlats],
    renters: [...mockRenters],
    messList: [...mockMess],
  })
}

export async function fetchBillsForTenant(
  tenantId?: string
): Promise<ApiResult<Bill[]>> {
  await mockDelay()
  return ok(getBillsByTenantId(tenantId || getDemoTenantId()))
}

export async function fetchBillsForOwner(
  ownerId?: string
): Promise<ApiResult<Bill[]>> {
  await mockDelay()
  const id = ownerId || getDemoOwnerId()
  return ok(mockBills.filter(b => b.ownerId === id))
}

export async function fetchBillById(id: string): Promise<ApiResult<Bill | undefined>> {
  await mockDelay(150)
  return ok(getBillById(id))
}

export async function saveBillsSnapshot(
  bills: Bill[]
): Promise<ApiResult<Bill[]>> {
  await mockDelay(100)
  mockBills.length = 0
  mockBills.push(...bills)
  return ok([...mockBills])
}

export async function saveBillTemplates(
  templates: BillTemplate[]
): Promise<ApiResult<BillTemplate[]>> {
  await mockDelay(100)
  mockBillTemplates.length = 0
  mockBillTemplates.push(...templates)
  return ok([...mockBillTemplates])
}

export async function saveBillRules(
  rules: BillGenerationRule[]
): Promise<ApiResult<BillGenerationRule[]>> {
  await mockDelay(100)
  mockBillGenerationRules.length = 0
  mockBillGenerationRules.push(...rules)
  return ok([...mockBillGenerationRules])
}

export async function saveMeterReadings(
  readings: MeterReading[]
): Promise<ApiResult<MeterReading[]>> {
  await mockDelay(100)
  mockMeterReadings.length = 0
  mockMeterReadings.push(...readings)
  return ok([...mockMeterReadings])
}

export async function scheduleBillPayment(
  payment: ScheduledPayment
): Promise<ApiResult<ScheduledPayment>> {
  await mockDelay(150)
  addScheduledPayment(payment)
  return ok(payment)
}

export async function markBillAsPaid(
  billId: string,
  paidAt?: string
): Promise<ApiResult<Bill>> {
  await mockDelay(100)
  const updated = markBillPaid(billId, paidAt)
  if (!updated) return err('Bill not found', 'NOT_FOUND')
  return ok(updated)
}

export async function fetchActiveBillTemplates(): Promise<
  ApiResult<BillTemplate[]>
> {
  await mockDelay()
  return ok(getActiveTemplates())
}

export async function fetchBillTemplatesByProperty(
  propertyId: string
): Promise<ApiResult<BillTemplate[]>> {
  await mockDelay()
  return ok(getTemplatesByProperty(propertyId))
}

export async function fetchActiveBillRules(): Promise<
  ApiResult<BillGenerationRule[]>
> {
  await mockDelay()
  return ok(getActiveRules())
}

export async function fetchPreviousMeterReadingApi(
  propertyId: string,
  meterType: MeterReading['meterType'],
  month: string,
  year: number
): Promise<ApiResult<MeterReading | undefined>> {
  await mockDelay(100)
  return ok(getPreviousMeterReading(propertyId, meterType, month, year))
}

export async function fetchMeterReadingApi(
  propertyId: string,
  meterType: MeterReading['meterType'],
  month: string,
  year: number
): Promise<ApiResult<MeterReading | undefined>> {
  await mockDelay(100)
  return ok(getMeterReading(propertyId, meterType, month, year))
}

export {
  getMeterReading,
  getPreviousMeterReading,
  getTemplateById,
  getRuleById,
  getActiveTemplates,
  getTemplatesByProperty,
}
