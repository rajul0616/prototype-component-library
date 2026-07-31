// Table of local login history: name, division, timestamp, approximate location, IP. Props: entries[], onClear.
import { History, Trash2 } from 'lucide-react'
import DataTable from '../../components/data/DataTable.jsx'
import EmptyState from '../../components/feedback/EmptyState.jsx'
import { formatDateTime } from './formatters.js'

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'division', label: 'Division', sortable: true },
  {
    key: 'timestamp',
    label: 'Logged In At',
    sortable: true,
    render: (row) => formatDateTime(row.timestamp),
  },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'ip', label: 'IP Address', sortable: true },
]

export default function AccessLogView({ entries = [], onClear }) {
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Access Log</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Recorded locally in this browser only — not shared or synced anywhere.
          </p>
        </div>
        {sorted.length > 0 ? (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Trash2 size={14} /> Clear log
          </button>
        ) : null}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={History}
          message="No logins recorded yet"
          description="Sign-ins on this browser will appear here."
        />
      ) : (
        <DataTable columns={COLUMNS} rows={sorted} pageSize={10} />
      )}
    </div>
  )
}
