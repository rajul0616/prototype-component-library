// Lease registry dashboard: portfolio metrics, "viewing as" division/landlord filter, risk/city filters, and the sortable property table.
import { useMemo, useState } from 'react'
import { Building2, AlertTriangle, Clock, DollarSign } from 'lucide-react'

import MetricCardRow from '../../components/dashboard/MetricCardRow.jsx'
import DataTable from '../../components/data/DataTable.jsx'
import EmptyState from '../../components/feedback/EmptyState.jsx'
import RiskBadge from './RiskBadge.jsx'
import CabinetApprovalTag from './CabinetApprovalTag.jsx'
import { getRiskStatus, getRiskRank } from './riskStatus.js'
import { mentionsCabinetApproval } from './cabinetFlag.js'
import { formatCurrency, formatDate } from './formatters.js'

const RISK_OPTIONS = ['Active', 'Expiring Soon', 'Expired']

const COLUMNS = [
  { key: 'address', label: 'Address', sortable: true },
  { key: 'city', label: 'City', sortable: true },
  { key: 'ministryDivisionAgency', label: 'Ministry / Division', sortable: true },
  { key: 'landlord', label: 'Landlord', sortable: true },
  { key: 'mainUse', label: 'Main Use', sortable: true },
  {
    key: 'monthlyRentalRate',
    label: 'Monthly Rental Rate',
    sortable: true,
    render: (row) => formatCurrency(row.monthlyRentalRate),
  },
  {
    key: 'riskRank',
    label: 'Risk Status',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <RiskBadge status={row.riskLabel} />
        {row.hasCabinetFlag ? <CabinetApprovalTag /> : null}
      </div>
    ),
  },
  {
    key: 'leaseEndDate',
    label: 'Lease End Date',
    sortable: true,
    render: (row) => formatDate(row.leaseEndDate),
  },
]

export default function Dashboard({ properties, onSelectProperty }) {
  const divisions = useMemo(
    () => [...new Set(properties.map((p) => p.ministryDivisionAgency))].sort(),
    [properties],
  )
  const landlords = useMemo(
    () => [...new Set(properties.map((p) => p.landlord))].sort(),
    [properties],
  )
  const cities = useMemo(
    () => [...new Set(properties.map((p) => p.city))].sort(),
    [properties],
  )

  const [viewingAs, setViewingAs] = useState('all')
  const [selectedLandlord, setSelectedLandlord] = useState(landlords[0] ?? '')
  const [riskFilter, setRiskFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')

  function handleViewingAsChange(value) {
    setViewingAs(value)
    if (value === 'landlord' && !selectedLandlord) {
      setSelectedLandlord(landlords[0] ?? '')
    }
  }

  function clearFilters() {
    setViewingAs('all')
    setRiskFilter('all')
    setCityFilter('all')
  }

  const rows = useMemo(() => {
    let filtered = properties

    if (viewingAs === 'landlord') {
      filtered = filtered.filter((p) => p.landlord === selectedLandlord)
    } else if (viewingAs !== 'all') {
      filtered = filtered.filter((p) => p.ministryDivisionAgency === viewingAs)
    }

    if (cityFilter !== 'all') {
      filtered = filtered.filter((p) => p.city === cityFilter)
    }

    const withRisk = filtered.map((p) => {
      const riskLabel = getRiskStatus(p.leaseEndDate)
      return {
        ...p,
        riskLabel,
        riskRank: getRiskRank(riskLabel),
        hasCabinetFlag: mentionsCabinetApproval(p),
      }
    })

    return riskFilter === 'all'
      ? withRisk
      : withRisk.filter((p) => p.riskLabel === riskFilter)
  }, [properties, viewingAs, selectedLandlord, cityFilter, riskFilter])

  const metrics = [
    {
      label: 'Total Properties',
      value: rows.length,
      icon: Building2,
      description: 'Number of properties currently matching your division, landlord, risk, and city filters.',
    },
    {
      label: 'Expired',
      value: rows.filter((p) => p.riskLabel === 'Expired').length,
      icon: AlertTriangle,
      description: "Properties whose lease end date has already passed as of today's date.",
    },
    {
      label: 'Expiring Soon',
      value: rows.filter((p) => p.riskLabel === 'Expiring Soon').length,
      icon: Clock,
      description: 'Properties whose lease ends within the next 90 days and is not yet expired.',
    },
    {
      label: 'Monthly Rental Exposure',
      value: formatCurrency(rows.reduce((sum, p) => sum + p.monthlyRentalRate, 0)),
      icon: DollarSign,
      description: 'Total monthly rent owed across the properties shown, excluding VAT.',
    },
  ]

  return (
    <div className="space-y-6">
      <MetricCardRow metrics={metrics} />

      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-gray-200 bg-white p-4">
        <Field label="Viewing as">
          <select
            value={viewingAs}
            onChange={(e) => handleViewingAsChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Properties</option>
            <optgroup label="By Division">
              {divisions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </optgroup>
            <option value="landlord">Landlord View</option>
          </select>
        </Field>

        {viewingAs === 'landlord' ? (
          <Field label="Landlord">
            <select
              value={selectedLandlord}
              onChange={(e) => setSelectedLandlord(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {landlords.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        <Field label="Risk Status">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All</option>
            {RISK_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>

        <Field label="City">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Building2}
          message="No properties match your filters"
          description="Try a different division, landlord, risk status, or city."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={rows}
          pageSize={8}
          onRowClick={(row) => onSelectProperty(row.id)}
        />
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-600">{label}</span>
      {children}
    </label>
  )
}
