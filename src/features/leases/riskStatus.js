// Computes lease risk status from a lease end date relative to a reference "today". Never manually set.
import { MOCK_TODAY } from '../../data/properties.js'

const DAY_MS = 1000 * 60 * 60 * 24
const EXPIRING_SOON_WINDOW_DAYS = 90

export function getRiskStatus(leaseEndDate, today = MOCK_TODAY) {
  const daysUntilEnd = (new Date(leaseEndDate) - new Date(today)) / DAY_MS
  if (daysUntilEnd < 0) return 'Expired'
  if (daysUntilEnd <= EXPIRING_SOON_WINDOW_DAYS) return 'Expiring Soon'
  return 'Active'
}

// Lower rank = more urgent; used to sort the risk column by severity rather than alphabetically.
export function getRiskRank(status) {
  return { Expired: 0, 'Expiring Soon': 1, Active: 2 }[status] ?? 3
}
