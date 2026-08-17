/** English fallbacks so confirm/action copy never shows raw i18n keys. */
export const PROPERTY_ADMIN_COPY = {
  approveTitle: 'Approve this property?',
  approveDesc: 'The listing will be published and visible to renters.',
  rejectReason: 'Please provide a reason for rejection:',
  approved: 'Property approved',
  rejected: 'Property rejected',
  suspendTitle: 'Suspend this property?',
  suspendDesc: 'The listing will be paused and hidden from search.',
  suspended: 'Property suspended',
  reactivateTitle: 'Reactivate this property?',
  reactivateDesc: 'The listing will be published again.',
  reactivated: 'Property reactivated',
  featureTitle: 'Feature this property?',
  featureDesc: 'It will be highlighted in featured listings.',
  removeFeatureTitle: 'Remove featured status?',
  removeFeatureDesc: 'This property will no longer appear as featured.',
  featureSuccess: 'Property featured',
  removeFeatureSuccess: 'Featured status removed',
  verifyTitle: 'Mark property as verified?',
  verifyDesc: 'Shows a verified badge on the listing.',
  removeVerifyTitle: 'Remove verification?',
  removeVerifyDesc: 'The verified badge will be removed.',
  verifySuccess: 'Property verified',
  removeVerifySuccess: 'Verification removed',
  btnApprove: 'Approve',
  btnReject: 'Reject',
  btnView: 'View',
  btnFeature: 'Feature',
  btnRemoveFeature: 'Unfeature',
  btnVerify: 'Verify',
  btnRemoveVerify: 'Unverify',
  btnSuspend: 'Suspend',
  btnReactivate: 'Reactivate',
  btnOpenListing: 'Open listing',
  detailsTitle: 'Review listing details and moderation status',
  labelOwner: 'Owner',
  labelRent: 'Rent',
  labelSubmitted: 'Submitted',
  labelReviewed: 'Reviewed',
  labelDescription: 'Description',
  labelRejectionReason: 'Rejection reason',
  badgeVerified: 'Verified',
  badgeNotVerified: 'Not verified',
  badgeFeatured: 'Featured',
} as const

export type PropertyAdminCopyKey = keyof typeof PROPERTY_ADMIN_COPY

export function readAdminPropertyCopy(messages: unknown): Partial<
  Record<PropertyAdminCopyKey, string>
> {
  if (!messages || typeof messages !== 'object') return {}
  const admin = (messages as { admin?: unknown }).admin
  if (!admin || typeof admin !== 'object') return {}
  const properties = (admin as { properties?: unknown }).properties
  if (!properties || typeof properties !== 'object') return {}

  const out: Partial<Record<PropertyAdminCopyKey, string>> = {}
  for (const key of Object.keys(PROPERTY_ADMIN_COPY) as PropertyAdminCopyKey[]) {
    const value = (properties as Record<string, unknown>)[key]
    if (typeof value === 'string' && value.trim()) out[key] = value
  }
  return out
}
