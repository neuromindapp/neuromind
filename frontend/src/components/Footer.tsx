import { Link } from 'react-router-dom'
import { ArrowUpRight, Github } from 'lucide-react'
import { ContractAddress } from '@/components/ContractAddress'

const xUrl = 'https://x.com/NeuroMindStudy'
const githubUrl = 'https://github.com/neuromindapp/neuromind'

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="relative z-10 px-4 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/[0.08] bg-[#07080b]/90">
        <div className="grid gap-8 px-6 py-9 sm:px-9 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div>
            <img src="/logo-transparent.png" alt="NeuroMind" className="h-8 w-auto" />
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">
              NeuroMind turns live prediction markets into research briefs, probability estimates, and resolution-risk notes. It does not custody funds or place trades.
            </p>
            <div className="mt-5">
              <ContractAddress variant="footer" />
            </div>
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NeuroMind on X"
              className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              <XIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NeuroMind on GitHub"
              className="ml-2 mt-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              <Github size={15} />
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterLinks title="Product" links={[
              { to: '/edges', label: 'Edge Board' },
              { to: '/track-record', label: 'Track Record' },
              { to: '/account', label: 'Account' },
            ]} />
            <FooterLinks title="Research" links={[
              { href: 'https://docs.neuro-mind.app', label: 'Docs' },
              { href: 'https://docs.neuro-mind.app/methodology', label: 'Methodology' },
              { href: 'https://docs.neuro-mind.app/reports', label: 'Reports' },
            ]} />
            <FooterLinks title="Legal" links={[
              { href: 'https://docs.neuro-mind.app/terms', label: 'Terms' },
              { href: 'https://docs.neuro-mind.app/privacy', label: 'Privacy' },
              { href: 'https://docs.neuro-mind.app/disclaimer', label: 'Disclaimer' },
            ]} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] px-6 py-5 sm:flex-row sm:px-9 lg:px-10">
          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} NeuroMind. Research tool only. Not financial advice.
          </p>
          <div className="flex items-center gap-4">
            <a href={xUrl} className="text-[11px] text-slate-500 transition-colors hover:text-white">X</a>
            <a href={githubUrl} className="text-[11px] text-slate-500 transition-colors hover:text-white">GitHub</a>
            <a href="https://docs.neuro-mind.app" className="inline-flex items-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-white">
              Docs <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLinks({ title, links }: { title: string; links: Array<{ label: string; href?: string; to?: string }> }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</h4>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.to ? (
              <Link to={link.to} className="text-[13px] text-slate-400 transition-colors hover:text-white">
                {link.label}
              </Link>
            ) : (
              <a href={link.href} className="text-[13px] text-slate-400 transition-colors hover:text-white">
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
