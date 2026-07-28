// Page frame with header (logo slot + title), collapsible sidebar (navItems[]), and main content area. Props: logo, title, navItems[{ label, icon, href, onClick, active }], children.
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function AppShell({ logo, title, navItems = [], children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-full bg-gradient-to-b from-violet-50/60 via-white to-white text-gray-900">
      <aside
        className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-200 ${
          sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'
        }`}
      >
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item, i) => (
            <button
              key={item.label ?? i}
              onClick={item.onClick}
              className={`flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-600 hover:bg-violet-50'
              }`}
            >
              {item.icon ? <item.icon size={16} /> : null}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur">
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            className="rounded-full p-1.5 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {logo ? <div className="flex items-center">{logo}</div> : null}
          {title ? (
            <h1 className="text-sm font-semibold text-gray-800">{title}</h1>
          ) : null}
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
