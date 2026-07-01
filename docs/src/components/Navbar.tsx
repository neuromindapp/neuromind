import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Github } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const githubUrl = 'https://github.com/neuromindapp/neuromind'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: 'https://neuro-mind.app/edges', label: 'Edge Board' },
    { href: 'https://neuro-mind.app/track-record', label: 'Track Record' },
    { href: 'https://neuro-mind.app/account', label: 'Account' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-5">
      <nav
        style={{
          maxWidth: scrolled ? '54rem' : '76rem',
          marginTop: scrolled ? '10px' : '14px',
          padding: scrolled ? '8px 12px' : '10px 14px',
          borderRadius: scrolled ? '16px' : '18px',
          background: scrolled ? 'rgba(6, 7, 10, 0.76)' : 'rgba(6, 7, 10, 0.52)',
          borderColor: scrolled ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.07)',
          transition: 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="mx-auto flex w-full items-center justify-between border backdrop-blur-xl"
      >
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-transparent.png" alt="NeuroMind" className="h-8 w-auto" />
          <span className="hidden text-[15px] font-semibold tracking-[0.01em] text-white sm:block">NeuroMind</span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-[12px] font-medium text-slate-400 transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
          <Link to="/" className="text-[12px] font-medium text-white">
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NeuroMind on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/[0.055] hover:text-white sm:inline-flex"
          >
            <Github size={15} />
          </a>
          <a
            href="https://neuro-mind.app"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-[12px] font-semibold text-black transition-colors hover:bg-slate-200 active:scale-[0.98]"
          >
            Launch App <ArrowRight size={13} />
          </a>
        </div>
      </nav>
    </header>
  )
}
