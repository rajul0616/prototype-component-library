// Single stat card. Props: label, value, trend { value, direction: 'up'|'down' } (optional), icon (component, optional).
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function MetricCard({ label, value, trend, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon ? <Icon size={18} className="text-violet-500" /> : null}
      </div>

      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        {trend ? (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {trend.value}%
          </span>
        ) : null}
      </div>
    </div>
  )
}
