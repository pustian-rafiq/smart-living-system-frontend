import type {
  Bill,
  BillTemplate,
  BillGenerationRule,
  MeterReading,
  GenerateBillData,
} from '@/types/bill'
import type { ScheduledPayment } from '@/types/payment'
import type { BillsBoardResponse } from './contracts'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchBillsBoard(): Promise<ApiResult<BillsBoardResponse>> {
  if (!hasAuthTokens()) {
    return {
      ok: true,
      data: {
        bills: [],
        templates: [],
        rules: [],
        meterReadings: [],
        buildings: [],
        flats: [],
        renters: [],
        messList: [],
      },
    }
  }
  return apiRequest<BillsBoardResponse>('/bills/board/')
}

export async function fetchBillsForTenant(
  _tenantId?: string,
): Promise<ApiResult<Bill[]>> {
  return apiRequest<Bill[]>('/bills/mine/')
}

export async function fetchBillsForOwner(
  _ownerId?: string,
): Promise<ApiResult<Bill[]>> {
  return apiRequest<Bill[]>('/bills/owner/')
}

export async function fetchBillById(
  id: string,
): Promise<ApiResult<Bill | undefined>> {
  const result = await apiRequest<Bill>(`/bills/${id}/`)
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return { ok: true, data: undefined }
    return result
  }
  return result
}

export async function saveBillsSnapshot(
  bills: Bill[],
): Promise<ApiResult<Bill[]>> {
  return apiRequest<Bill[]>('/bills/bulk/', {
    method: 'PUT',
    body: bills,
  })
}

export async function generateBill(
  data: GenerateBillData & {
    flatNumber?: string
    seatNumber?: string
    tenantName?: string
    propertyName?: string
    templateId?: string
  },
): Promise<ApiResult<Bill>> {
  return apiRequest<Bill>('/bills/generate/', {
    method: 'POST',
    body: data,
  })
}

export async function bulkGenerateBills(data: {
  buildingId?: string
  flatIds?: string[]
  month: string
  year: number
  templateId?: string
  includeUnpaid?: boolean
}): Promise<ApiResult<Bill[]>> {
  return apiRequest<Bill[]>('/bills/bulk-generate/', {
    method: 'POST',
    body: data,
  })
}

export async function saveBillTemplates(
  templates: BillTemplate[],
): Promise<ApiResult<BillTemplate[]>> {
  return apiRequest<BillTemplate[]>('/bill-templates/bulk/', {
    method: 'PUT',
    body: templates,
  })
}

export async function saveBillRules(
  rules: BillGenerationRule[],
): Promise<ApiResult<BillGenerationRule[]>> {
  return apiRequest<BillGenerationRule[]>('/bill-rules/bulk/', {
    method: 'PUT',
    body: rules,
  })
}

export async function saveMeterReadings(
  readings: MeterReading[],
): Promise<ApiResult<MeterReading[]>> {
  return apiRequest<MeterReading[]>('/meter-readings/bulk/', {
    method: 'PUT',
    body: readings,
  })
}

export async function scheduleBillPayment(
  payment: ScheduledPayment,
): Promise<ApiResult<ScheduledPayment>> {
  const { createScheduledPayment } = await import('./payments')
  return createScheduledPayment(payment)
}

export async function markBillAsPaid(
  billId: string,
  paidAt?: string,
): Promise<ApiResult<Bill>> {
  return apiRequest<Bill>(`/bills/${billId}/mark-paid/`, {
    method: 'POST',
    body: { paidAt },
  })
}

export async function fetchActiveBillTemplates(): Promise<
  ApiResult<BillTemplate[]>
> {
  return apiRequest<BillTemplate[]>('/bill-templates/active/')
}

export async function fetchBillTemplatesByProperty(
  propertyId: string,
): Promise<ApiResult<BillTemplate[]>> {
  return apiRequest<BillTemplate[]>(
    `/bill-templates/?property_id=${encodeURIComponent(propertyId)}`,
  )
}

export async function fetchActiveBillRules(): Promise<
  ApiResult<BillGenerationRule[]>
> {
  return apiRequest<BillGenerationRule[]>('/bill-rules/active/')
}

export async function fetchPreviousMeterReadingApi(
  propertyId: string,
  _meterType: string | undefined,
  month: string,
  year: number,
  flatId?: string,
): Promise<ApiResult<MeterReading | undefined>> {
  const params = new URLSearchParams({
    property_id: propertyId,
    month,
    year: String(year),
  })
  if (flatId) params.set('flat_id', flatId)
  const result = await apiRequest<MeterReading | null>(
    `/meter-readings/previous/?${params}`,
  )
  if (!result.ok) return result
  return { ok: true, data: result.data ?? undefined }
}

export async function fetchMeterReadingApi(
  propertyId: string,
  _meterType: string | undefined,
  month: string,
  year: number,
  flatId?: string,
): Promise<ApiResult<MeterReading | undefined>> {
  const params = new URLSearchParams({
    property_id: propertyId,
    month,
    year: String(year),
  })
  if (flatId) params.set('flat_id', flatId)
  const result = await apiRequest<MeterReading | null>(
    `/meter-readings/current/?${params}`,
  )
  if (!result.ok) return result
  return { ok: true, data: result.data ?? undefined }
}

export async function getMeterReading(
  propertyId: string,
  flatId: string | undefined,
  _seatId: string | undefined,
  month: string,
  year: number,
): Promise<MeterReading | undefined> {
  const r = await fetchMeterReadingApi(
    propertyId,
    undefined,
    month,
    year,
    flatId,
  )
  return r.ok ? r.data : undefined
}

export async function getPreviousMeterReading(
  propertyId: string,
  flatId: string | undefined,
  _seatId: string | undefined,
  month: string,
  year: number,
): Promise<MeterReading | undefined> {
  const r = await fetchPreviousMeterReadingApi(
    propertyId,
    undefined,
    month,
    year,
    flatId,
  )
  return r.ok ? r.data : undefined
}

export async function getTemplateById(
  id: string,
): Promise<BillTemplate | undefined> {
  const board = await fetchBillsBoard()
  if (!board.ok) return undefined
  return board.data.templates.find(t => t.id === id)
}

export async function getRuleById(
  id: string,
): Promise<BillGenerationRule | undefined> {
  const board = await fetchBillsBoard()
  if (!board.ok) return undefined
  return board.data.rules.find(r => r.id === id)
}

export async function getActiveTemplates(): Promise<BillTemplate[]> {
  const r = await fetchActiveBillTemplates()
  return r.ok ? r.data : []
}

export async function getTemplatesByProperty(
  propertyId: string,
): Promise<BillTemplate[]> {
  const r = await fetchBillTemplatesByProperty(propertyId)
  return r.ok ? r.data : []
}
