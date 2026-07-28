// Single stat card. Props: label, value, trend { value, direction: 'up'|'down' } (optional), icon (component, optional), description (optional, shown in a hover tooltip), onClick + active (optional, makes the card a filter toggle).
import { TrendingUp, TrendingDown, Info } from 'lucide-react'

export default function MetricCard({ label, value, trend, icon: Icon, description, onClick, active }) {
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left shadow-sm transition-colors ${
        active ? 'border-violet-500 ring-2 ring-violet-100' : 'border-gray-200'
      } bg-white ${onClick ? 'cursor-pointer hover:border-violet-300' : ''}`}
    >
      <div className="flex items-start justify-between">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-500">
          {label}
          {description ? (
            <span className="group relative inline-flex">
              <Info size={13} className="cursor-help text-gray-300 hover:text-gray-400" />
              <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 hidden w-48 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1.5 text-xs font-normal leading-snug text-white shadow-lg group-hover:block">
                {description}
              </span>
            </span>
          ) : null}
        </span>
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
    </Wrapper>
  )
}
