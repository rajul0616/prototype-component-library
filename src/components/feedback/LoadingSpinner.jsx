// Simple spinner for loading states. Props: size (px, optional), label (optional caption below spinner).
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 24, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6 text-violet-400">
      <Loader2 size={size} className="animate-spin" />
      {label ? <span className="text-sm text-gray-400">{label}</span> : null}
    </div>
  )
}
