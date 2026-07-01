import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'

const nav = [
  {
    group: 'Overview',
    items: [
      { label: 'Introduction', to: '/' },
      { label: 'Getting Started', to: '/getting-started' },
      { label: 'Access Model', to: '/access-model' },
      { label: 'Methodology', to: '/methodology' },
    ],
  },
  {
    group: 'Product',
    items: [
      { label: 'Edge Board', to: '/edge-board' },
      { label: 'Reports', to: '/reports' },
      { label: 'Track Record', to: '/track-record' },
      { label: 'Account', to: '/account' },
      { label: 'Payments', to: '/payments' },
    ],
  },
  {
    group: 'Help',
    items: [{ label: 'FAQ', to: '/faq' }],
  },
  {
    group: 'Legal',
    items: [
      { label: 'Terms', to: '/terms' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Disclaimer', to: '/disclaimer' },
    ],
  },
]

export { nav }

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-50 h-dvh w-[270px] border-r border-white/[0.08] bg-[#050506] p-6 pt-4 transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <img src="/logo-transparent.png" alt="NeuroMind" className="h-6 w-auto" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">docs</span>
          </Link>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white">
            <X size={15} />
          </button>
        </div>

        <NavLinks pathname={pathname} onClose={onClose} />
      </aside>
    </>
  )
}

export function DesktopSidebar() {
  const { pathname } = useLocation()

  return (
    <div className="hidden w-[190px] shrink-0 lg:block">
      <div className="sticky top-[104px]">
        <NavLinks pathname={pathname} />
      </div>
    </div>
  )
}

function NavLinks({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <nav>
      {nav.map((section, index) => (
        <div key={section.group} className={index > 0 ? 'mt-6' : ''}>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
            {section.group}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.to || (item.to === '/' && pathname === '')
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className={[
                      'relative flex items-center rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors',
                      active ? 'bg-white/[0.06] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
                    ].join(' ')}
                  >
                    {active && <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-white/70" />}
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
