// Demo app wiring every component together with sample data — reference for how to compose the library, not itself reusable.
import { useEffect, useState } from 'react'
import { Users, DollarSign, Activity, TrendingUp, LayoutDashboard, Inbox, Plus } from 'lucide-react'

import AppShell from './components/layout/AppShell.jsx'
import DataTable from './components/data/DataTable.jsx'
import MetricCardRow from './components/dashboard/MetricCardRow.jsx'
import { generateMockRecords, fakeFetch } from './components/data/mockData.js'
import LoginScreen from './components/auth/LoginScreen.jsx'
import RecordModal from './components/modals/RecordModal.jsx'
import LoadingSpinner from './components/feedback/LoadingSpinner.jsx'
import EmptyState from './components/feedback/EmptyState.jsx'
import Toast from './components/feedback/Toast.jsx'

const STATUS_OPTIONS = ['active', 'pending', 'inactive']

const RECORD_SHAPE = {
  id: 'id',
  name: 'name',
  email: 'email',
  status: (i) => STATUS_OPTIONS[i % STATUS_OPTIONS.length],
  createdAt: 'date',
}

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
]

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalRecord, setModalRecord] = useState(null)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (!loggedIn) return
    setLoading(true)
    fakeFetch(generateMockRecords(23, RECORD_SHAPE), 700).then((data) => {
      setRecords(data)
      setLoading(false)
    })
  }, [loggedIn])

  function addToast(message, variant = 'info') {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, variant }])
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function handleSaveRecord(values) {
    setRecords((prev) => {
      const exists = prev.some((r) => r.id === modalRecord?.id)
      if (exists) return prev.map((r) => (r.id === modalRecord.id ? { ...r, ...values } : r))
      return [{ ...values, id: prev.length + 1 }, ...prev]
    })
    addToast('Record saved successfully', 'success')
    setModalRecord(null)
  }

  if (!loggedIn) {
    return (
      <LoginScreen
        title="Sign in to Demo App"
        onLogin={(email) => {
          setLoggedIn(true)
          addToast(`Signed in as ${email}`, 'success')
        }}
      />
    )
  }

  const metrics = [
    { label: 'Total Records', value: records.length, icon: Users, trend: { value: 8, direction: 'up' } },
    { label: 'Revenue', value: '$12.4k', icon: DollarSign, trend: { value: 3, direction: 'down' } },
    { label: 'Active', value: records.filter((r) => r.status === 'active').length, icon: Activity },
    { label: 'Growth', value: '4.2%', icon: TrendingUp, trend: { value: 12, direction: 'up' } },
  ]

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: activeView === 'dashboard', onClick: () => setActiveView('dashboard') },
    { label: 'Empty State Demo', icon: Inbox, active: activeView === 'empty', onClick: () => setActiveView('empty') },
  ]

  return (
    <>
      <AppShell
        title="Component Library Demo"
        logo={<div className="h-6 w-6 rounded-full bg-violet-600" />}
        navItems={navItems}
      >
        {activeView === 'dashboard' ? (
          <div className="space-y-6">
            <MetricCardRow metrics={metrics} />

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Records</h2>
              <button
                onClick={() => setModalRecord({ id: null, name: '', email: '', status: 'active', createdAt: '' })}
                className="flex items-center gap-1.5 rounded-full bg-violet-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
              >
                <Plus size={14} /> Add record
              </button>
            </div>

            {loading ? (
              <LoadingSpinner label="Loading records…" />
            ) : (
              <DataTable
                columns={COLUMNS}
                rows={records}
                pageSize={8}
                onRowClick={(row) => setModalRecord(row)}
              />
            )}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            message="Nothing here yet"
            description="This is what an empty view looks like."
            actionLabel="Create item"
            onAction={() => addToast('Create action triggered', 'info')}
          />
        )}
      </AppShell>

      <RecordModal
        isOpen={Boolean(modalRecord)}
        onClose={() => setModalRecord(null)}
        title={modalRecord?.id ? 'Edit record' : 'Add record'}
        fields={[
          { name: 'name', label: 'Name', type: 'text', value: modalRecord?.name },
          { name: 'email', label: 'Email', type: 'email', value: modalRecord?.email },
          { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, value: modalRecord?.status },
        ]}
        onSave={handleSaveRecord}
      />

      <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  )
}
