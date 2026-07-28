// Responsive grid of MetricCards. Props: metrics[] (each spread into a MetricCard: label, value, trend, icon).
import MetricCard from './MetricCard.jsx'

export default function MetricCardRow({ metrics = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <MetricCard key={metric.label ?? i} {...metric} />
      ))}
    </div>
  )
}
