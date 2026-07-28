// Placeholder for empty lists/views. Props: icon (component, optional), message, description (optional), actionLabel + onAction (optional CTA).
export default function EmptyState({ icon: Icon, message, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 p-10 text-center">
      {Icon ? <Icon size={32} className="mb-1 text-gray-300" /> : null}
      <p className="text-sm font-medium text-gray-700">{message}</p>
      {description ? <p className="text-sm text-gray-400">{description}</p> : null}
      {actionLabel ? (
        <button
          onClick={onAction}
          className="mt-3 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
