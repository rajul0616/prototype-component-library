// Colored badge for a lease risk status: Expired (red), Expiring Soon (amber), Active (green).
const STYLES = {
  Expired: 'bg-red-50 text-red-700 ring-red-200',
  'Expiring Soon': 'bg-amber-50 text-amber-700 ring-amber-200',
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export default function RiskBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        STYLES[status] ?? 'bg-gray-50 text-gray-600 ring-gray-200'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
