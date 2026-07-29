// Page frame with header (logo slot + title + optional right-side slot), collapsible sidebar (navItems[]), and main content area. Props: logo, title, navItems[{ label, icon, href, onClick, active }], headerRight, children. Sidebar is an off-canvas overlay below the md breakpoint and pushes content at md+.
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function AppShell({ logo, title, navItems = [], headerRight, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === 'undefined' || window.innerWidth >= 768,
  )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white text-gray-900">
      {sidebarOpen ? (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-gray-200 bg-white transition-transform duration-200 md:relative md:z-auto md:w-56 md:transform-none md:transition-all ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:overflow-hidden md:border-r-0'
        }`}
      >
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item, i) => (
            <button
              key={item.label ?? i}
              onClick={item.onClick}
              className={`flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-600 hover:bg-blue-50'
              }`}
            >
              {item.icon ? <item.icon size={16} /> : null}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur">
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            className="shrink-0 rounded-full p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-700"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {logo ? <div className="flex shrink-0 items-center">{logo}</div> : null}
          {title ? (
            <h1 className="truncate text-sm font-semibold text-gray-800">{title}</h1>
          ) : null}
          {headerRight ? (
            <div className="ml-auto flex min-w-0 items-center">{headerRight}</div>
          ) : null}
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
