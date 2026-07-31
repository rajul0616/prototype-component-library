// Local (browser-only) login history: who signed in, their division, when, and an approximate IP-based location. No backend — persisted to localStorage on this device only.
const STORAGE_KEY = 'leaseRegistry.accessLog'

export function getAccessLog() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function saveAccessLog(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return entries
}

export function recordLoginStart({ name, division }) {
  const id = crypto.randomUUID()
  const entry = {
    id,
    name,
    division,
    timestamp: new Date().toISOString(),
    location: 'Locating…',
    ip: '',
  }
  return { id, entries: saveAccessLog([...getAccessLog(), entry]) }
}

export async function resolveLoginLocation(id) {
  let location = 'Unknown'
  let ip = ''
  try {
    const res = await fetch('https://ipapi.co/json/')
    const geo = await res.json()
    location = [geo.city, geo.region, geo.country_name].filter(Boolean).join(', ') || 'Unknown'
    ip = geo.ip ?? ''
  } catch {
    // keep defaults if the lookup fails (offline, rate-limited, blocked)
  }
  const updated = getAccessLog().map((e) => (e.id === id ? { ...e, location, ip } : e))
  return saveAccessLog(updated)
}

export function clearAccessLog() {
  return saveAccessLog([])
}
