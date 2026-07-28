// Single dismissible toast notification. Props: message, variant ('success'|'error'|'info'), onClose, duration (ms, auto-dismiss).
import { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const VARIANTS = {
  success: { icon: CheckCircle2, classes: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  error: { icon: XCircle, classes: 'bg-red-50 text-red-800 border-red-200' },
  info: { icon: Info, classes: 'bg-violet-50 text-violet-800 border-violet-200' },
}

export default function Toast({ message, variant = 'info', onClose, duration = 4000 }) {
  const { icon: Icon, classes } = VARIANTS[variant] ?? VARIANTS.info

  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(() => onClose?.(), duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-sm ${classes}`}>
      <Icon size={16} />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100" aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  )
}
