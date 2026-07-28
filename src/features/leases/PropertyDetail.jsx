// Full detail view for a single leased property: fields, risk badge, activity timeline, and a form to append new activity log entries.
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import RiskBadge from './RiskBadge.jsx'
import CabinetApprovalTag from './CabinetApprovalTag.jsx'
import { getRiskStatus } from './riskStatus.js'
import { mentionsCabinetApproval } from './cabinetFlag.js'
import { formatCurrency, formatDate } from './formatters.js'

export default function PropertyDetail({ property, currentUser, onBack, onAddActivity }) {
  const [note, setNote] = useState('')

  const riskStatus = getRiskStatus(property.leaseEndDate)
  const hasCabinetFlag = mentionsCabinetApproval(property)
  const timeline = [...property.activityLog].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (!note.trim()) return
    onAddActivity(property.id, note.trim())
    setNote('')
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-700"
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900">{property.address}</h1>
          <RiskBadge status={riskStatus} />
          {hasCabinetFlag ? <CabinetApprovalTag /> : null}
        </div>
        <p className="text-sm text-gray-500">{property.city}</p>

        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <Field label="Ministry / Division / Agency" value={property.ministryDivisionAgency} />
          <Field label="Landlord" value={property.landlord} />
          <Field label="Main Use" value={property.mainUse} />
          <Field label="Square Footage (Net Usable)" value={`${property.squareFootage.toLocaleString()} sq ft`} />
          <Field label="Monthly Rental Rate (VAT Excl.)" value={formatCurrency(property.monthlyRentalRate)} />
          <Field label="Date of Occupation" value={formatDate(property.dateOfOccupation)} />
          <Field label="Lease Start Date" value={formatDate(property.leaseStartDate)} />
          <Field label="Lease End Date" value={formatDate(property.leaseEndDate)} />
          <Field label="Lease Length" value={`${property.leaseLengthYears} years`} />
        </dl>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Activity Log</h2>

        <ol className="space-y-4 border-l-2 border-gray-100 pl-4">
          {timeline.map((entry, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
              <p className="text-xs font-medium text-gray-400">
                {formatDate(entry.timestamp)}
                {entry.loggedByUser ? ` · ${entry.loggedByUser}` : ''} · {entry.loggedByDivision}
              </p>
              <p className="mt-0.5 text-sm text-gray-700">{entry.note}</p>
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            Logging as <span className="font-medium text-gray-700">{currentUser.name}</span> ·{' '}
            {currentUser.division}
          </p>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-600">Note</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Add a status update, renewal note, or risk flag…"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>

          <button
            type="submit"
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Add entry
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-800">{value}</dd>
    </div>
  )
}
