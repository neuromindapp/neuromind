import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, Github } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { shortWallet } from '@/lib/format'

export function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { ready, authenticated, logout, login, walletAddress } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const githubUrl = 'https://github.com/neuromindapp/neuromind'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: 'Research' },
    { to: '/edges', label: 'Edge Board' },
    { to: '/track-record', label: 'Track Record' },
    { to: '/account', label: 'Account' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-5">
      <nav
        style={{
          maxWidth: scrolled ? '56rem' : '76rem',
          marginTop: scrolled ? '10px' : '14px',
          padding: scrolled ? '8px 12px' : '10px 14px',
          borderRadius: scrolled ? '16px' : '18px',
          background: scrolled ? 'rgba(6, 7, 10, 0.74)' : 'rgba(6, 7, 10, 0.46)',
          borderColor: scrolled ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.07)',
          transition: 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="mx-auto flex w-full items-center justify-between border backdrop-blur-xl"
      >
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/logo-transparent.png"
            alt="NeuroMind"
            style={{
              height: scrolled ? '30px' : '34px',
              transition: 'height 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="w-auto"
          />
          <span
            style={{
              opacity: scrolled ? 0 : 1,
              width: scrolled ? '0px' : '112px',
              overflow: 'hidden',
              transition: 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="hidden whitespace-nowrap text-[15px] font-semibold tracking-[0.01em] text-white sm:block"
          >
            NeuroMind
          </span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => {
            const active = pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  'relative text-[12px] font-medium text-slate-400 transition-colors hover:text-white',
                  active ? 'text-white' : '',
                ].join(' ')}
              >
                {link.label}
                {active && <span className="absolute -bottom-2 left-1/2 h-px w-5 -translate-x-1/2 bg-white/70" />}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://docs.neuro-mind.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center rounded-lg px-3 text-[12px] font-medium text-slate-300 transition-colors hover:text-white sm:inline-flex"
          >
            Docs
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NeuroMind on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/[0.055] hover:text-white sm:inline-flex"
          >
            <Github size={15} />
          </a>
          {ready && !authenticated && (
            <button
              onClick={login}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-[12px] font-semibold text-black transition-colors hover:bg-slate-200 active:scale-[0.98]"
            >
              Login <ArrowRight size={13} />
            </button>
          )}
          {ready && authenticated && walletAddress && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/account')}
                className="h-9 rounded-lg border border-white/10 bg-white/[0.035] px-3 font-mono text-[12px] text-slate-200 transition-colors hover:bg-white/[0.07]"
              >
                {shortWallet(walletAddress)}
              </button>
              <button
                onClick={logout}
                className="hidden h-9 px-2 text-[12px] font-medium text-slate-500 transition-colors hover:text-white sm:inline-flex sm:items-center"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
