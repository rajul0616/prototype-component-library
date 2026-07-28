// Roadmap teaser listing upcoming capabilities — visible but not distracting. Props: items[{ icon, label }].
import { Sparkles } from 'lucide-react'

export default function ComingSoon({ items = [] }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
        <Sparkles size={12} />
        Coming soon
      </span>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
            {Icon ? <Icon size={14} className="text-blue-500" /> : null}
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
