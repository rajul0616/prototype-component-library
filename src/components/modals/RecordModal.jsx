// Generic add/edit modal for any record shape. Props: isOpen, onClose, title, fields[{ name, label, type, value, options }], onSave(values).
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function RecordModal({ isOpen, onClose, title = 'Edit record', fields = [], onSave }) {
  const [values, setValues] = useState({})

  useEffect(() => {
    if (isOpen) {
      const initial = {}
      for (const field of fields) initial[field.name] = field.value ?? ''
      setValues(initial)
    }
  }, [isOpen, fields])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function setValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave?.(values)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={values[field.name] ?? ''}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : field.type === 'select' ? (
                <select
                  value={values[field.name] ?? ''}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {(field.options ?? []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={Boolean(values[field.name])}
                  onChange={(e) => setValue(field.name, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              ) : (
                <input
                  type={field.type ?? 'text'}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
