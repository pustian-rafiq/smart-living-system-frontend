/**
 * Re-exports demo identity helpers for API layer consumers.
 * @see lib/auth/demo-identity.ts
 */
export {
  getDemoRenterId,
  setDemoRenterId,
  getDemoOwnerId,
  setDemoOwnerId,
  getDemoTenantId,
  setDemoTenantId,
  getDemoChatUserId,
  setDemoChatUserId,
  syncDemoIdentityForRole,
  clearDemoIdentity,
  getDemoUserId,
  resolvePaymentUserId,
  getDemoRenterProfile,
} from '@/lib/auth/demo-identity'
