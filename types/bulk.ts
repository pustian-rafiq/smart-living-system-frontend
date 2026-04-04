export interface BulkBillGenerationData {
  buildingId?: string
  floorIds?: string[]
  flatIds?: string[]
  month: string
  year: number
  templateId?: string
  includeUnpaid: boolean
}

export interface BulkNoticeData {
  buildingId?: string
  floorIds?: string[]
  flatIds?: string[]
  messId?: string
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  category:
    | 'general'
    | 'payment'
    | 'maintenance'
    | 'event'
    | 'announcement'
    | 'rule'
    | 'other'
  expiryDate?: string
  pdfUrl?: string
  imageUrls?: string[]
}

export interface BulkSMSData {
  buildingId?: string
  floorIds?: string[]
  flatIds?: string[]
  messId?: string
  recipientType: 'all' | 'owners' | 'renters' | 'custom'
  customRecipients?: string[]
  message: string
  scheduledTime?: string
}

export interface BulkOperationResult {
  success: boolean
  total: number
  successful: number
  failed: number
  errors?: string[]
}
