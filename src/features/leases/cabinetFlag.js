// Flags properties whose activity log mentions Cabinet approval (pending, interim, or granted) — a priority signal for the roadmap's approval-tracking workflow.
export function mentionsCabinetApproval(property) {
  return property.activityLog.some((entry) => /cabinet/i.test(entry.note))
}
