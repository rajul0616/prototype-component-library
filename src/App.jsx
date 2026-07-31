// Government property lease registry MVP — wires the reusable component library to the Vantiqa case study data model.
import { useMemo, useState } from 'react'
import { Building2, LogOut } from 'lucide-react'

import AppShell from './components/layout/AppShell.jsx'
import Toast from './components/feedback/Toast.jsx'
import IdentityGate from './features/leases/IdentityGate.jsx'
import Dashboard from './features/leases/Dashboard.jsx'
import PropertyDetail from './features/leases/PropertyDetail.jsx'
import { properties as seedProperties } from './data/properties.js'
import { recordLoginStart, resolveLoginLocation } from './features/leases/accessLog.js'

export default function App() {
  const [properties, setProperties] = useState(seedProperties)
  const [selectedId, setSelectedId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const divisions = useMemo(
    () => [...new Set(properties.map((p) => p.ministryDivisionAgency))].sort(),
    [properties],
  )
  const selectedProperty = properties.find((p) => p.id === selectedId)

  function addToast(message, variant = 'info') {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, variant }])
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function handleLogin(identity) {
    setCurrentUser(identity)
    const { id } = recordLoginStart(identity)
    resolveLoginLocation(id)
  }

  function handleAddActivity(propertyId, note) {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              activityLog: [
                ...p.activityLog,
                {
                  timestamp: new Date().toISOString(),
                  loggedByUser: currentUser.name,
                  loggedByDivision: currentUser.division,
                  note,
                },
              ],
            }
          : p,
      ),
    )
    addToast('Activity logged', 'success')
  }

  if (!currentUser) {
    return <IdentityGate divisions={divisions} onSubmit={handleLogin} />
  }

  return (
    <>
      <AppShell
        title="Property Lease Registry"
        logo={<Building2 size={20} className="text-blue-700" />}
        navItems={[{ label: 'Properties', icon: Building2, active: true }]}
        headerRight={
          <div className="flex min-w-0 items-center gap-2 text-sm text-gray-500 sm:gap-3">
            <span className="min-w-0 truncate">
              <span className="font-medium text-gray-700">{currentUser.name}</span>
              <span className="hidden sm:inline"> · {currentUser.division}</span>
            </span>
            <button
              onClick={() => setCurrentUser(null)}
              className="shrink-0 flex items-center gap-1 rounded-full p-1.5 hover:bg-blue-50 hover:text-blue-700"
              aria-label="Switch user"
            >
              <LogOut size={16} />
            </button>
          </div>
        }
      >
        {selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            currentUser={currentUser}
            onBack={() => setSelectedId(null)}
            onAddActivity={handleAddActivity}
          />
        ) : (
          <Dashboard properties={properties} onSelectProperty={setSelectedId} />
        )}
      </AppShell>

      <div className="fixed bottom-4 right-4 left-4 z-50 flex flex-col gap-2 sm:left-auto sm:w-80">
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
