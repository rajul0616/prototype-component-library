// Subtle tag flagging that a property's activity log mentions Cabinet approval.
import { Landmark } from 'lucide-react'

export default function CabinetApprovalTag() {
  return (
    <span
      title="Activity log mentions Cabinet approval"
      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
    >
      <Landmark size={11} />
      Cabinet
    </span>
  )
}
