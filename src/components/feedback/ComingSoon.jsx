// Subtle roadmap teaser listing upcoming capabilities. Props: items[{ icon, label }].
export default function ComingSoon({ items = [] }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
      <span className="inline-flex items-center rounded-full bg-gray-200/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-500">
        Coming soon
      </span>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5 text-sm text-gray-500">
            {Icon ? <Icon size={14} className="text-gray-400" /> : null}
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
