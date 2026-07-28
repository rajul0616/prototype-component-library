// Lightweight identity capture before the dashboard loads — no auth, just attributes activity log entries to a real name + division. Props: divisions[], onSubmit({ name, division }).
import { useState } from 'react'
import { Building2 } from 'lucide-react'

export default function IdentityGate({ divisions, onSubmit }) {
  const [name, setName] = useState('')
  const [division, setDivision] = useState(divisions[0] ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Enter your name to continue')
      return
    }
    onSubmit({ name: name.trim(), division })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 via-white to-white px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex justify-center">
          <Building2 size={28} className="text-blue-700" />
        </div>
        <h1 className="mb-1 text-center text-lg font-semibold text-gray-900">
          Property Lease Registry
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Sign in to view and update the lease register.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Your name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Ramnarine"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 ${
                error ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Division</span>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            >
              {divisions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
