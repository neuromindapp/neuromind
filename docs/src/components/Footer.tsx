import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const xUrl = 'https://x.com/NeuroMindStudy'
const githubUrl = 'https://github.com/neuromindapp/neuromind'

export function Footer() {
  return (
    <footer className="px-4 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/[0.08] bg-[#07080b]">
        <div className="flex flex-col justify-between gap-6 border-b border-white/[0.08] px-8 py-9 sm:flex-row sm:items-center sm:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">NeuroMind docs</p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-white">
              Methods, report access, and product limits.
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Static documentation for a research-first prediction market workflow.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://neuro-mind.app" className="btn-primary">
              Launch App <ArrowUpRight size={14} />
            </a>
            <Link to="/methodology" className="btn-secondary">
              Methodology
            </Link>
          </div>
        </div>

        <div className="grid gap-10 px-8 py-9 sm:px-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <img src="/logo-transparent.png" alt="NeuroMind" className="h-8 w-auto" />
            <p className="mt-4 max-w-sm text-[13px] leading-7 text-slate-500">
              Prediction-market analysis for probability gaps, source review, and resolution-risk analysis.
            </p>
          </div>

          <FooterLinks title="Product" links={[
            { href: 'https://neuro-mind.app/edges', label: 'Edge Board' },
            { href: 'https://neuro-mind.app/track-record', label: 'Track Record' },
            { href: 'https://neuro-mind.app/account', label: 'Account' },
          ]} />
          <FooterLinks title="Docs" links={[
            { to: '/', label: 'Introduction' },
            { to: '/reports', label: 'Reports' },
            { to: '/methodology', label: 'Methodology' },
          ]} />
          <FooterLinks title="Links" links={[
            { href: xUrl, label: 'X' },
            { href: githubUrl, label: 'GitHub' },
            { to: '/disclaimer', label: 'Disclaimer' },
          ]} />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] px-8 py-5 sm:flex-row sm:px-10">
          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} NeuroMind. Research tool only.
          </p>
          <span className="text-[11px] text-slate-500">Not financial advice. Not affiliated with Polymarket.</span>
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
