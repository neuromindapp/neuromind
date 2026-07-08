import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BookOpen, FileSearch, Gauge, Microscope } from 'lucide-react'
import { ContractAddress } from '@/components/ContractAddress'

const domains = [
  'Elections',
  'Policy',
  'Macro',
  'Crypto',
  'Science',
  'Culture',
]

const workflow = [
  {
    icon: FileSearch,
    title: 'Find disagreement',
    desc: 'Markets are ranked by distance between live pricing and the independent research estimate.',
  },
  {
    icon: Microscope,
    title: 'Read the case',
    desc: 'Each report separates drivers, sources, model assumptions, and rule wording issues.',
  },
  {
    icon: Gauge,
    title: 'Check calibration',
    desc: 'Resolved calls stay visible so the system can be judged by outcomes, not presentation.',
  },
]

export default function Landing() {
  return (
    <div className="overflow-hidden bg-[#050506]">
      <section className="relative flex min-h-[92dvh] items-center overflow-hidden px-4 pt-24 sm:px-6 lg:px-8">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/72" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,6,0.18)_0%,rgba(5,5,6,0.68)_66%,#050506_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-[#050506]/90 to-[#050506]" />

        <div className="relative mx-auto w-full max-w-7xl pb-16">
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2.35rem,5vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
              Research prediction markets with a colder signal.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              NeuroMind scans live markets, builds probability briefs, and flags resolution risk before you spend time on a position.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/edges" className="btn-primary">
                Go to app <ArrowRight size={15} />
              </Link>
              <a href="https://docs.neuro-mind.app" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Read docs <BookOpen size={15} />
              </a>
            </div>
            <div className="mt-5">
              <ContractAddress />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Research domains</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              A narrower board built around subjects that need evidence.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {domains.map((domain) => (
              <Link
                key={domain}
                to={`/edges?category=${domain.toLowerCase()}`}
                className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
              >
                {domain}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 md:grid-cols-3">
            {workflow.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-5">
                  <Icon className="h-5 w-5 text-slate-300" />
                  <h3 className="mt-7 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-2xl border border-white/[0.08] bg-[#08090c] p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Analysis brief</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Probability is only one line in the report.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              The useful work is the separation: market odds, model estimate, evidence quality, source-of-truth risk, and what would make the call wrong.
            </p>
          </div>
          <div className="space-y-2">
            {[
              ['Market odds', 'What traders are pricing now.'],
              ['Research estimate', 'The independent model view.'],
              ['Resolution risk', 'Where wording can break the thesis.'],
              ['Decision notes', 'Why the disagreement exists.'],
            ].map(([title, body]) => (
              <div key={title} className="grid grid-cols-[0.8fr_1.2fr] gap-4 border-t border-white/[0.08] py-3 first:border-t-0">
                <p className="text-sm font-medium text-slate-200">{title}</p>
                <p className="text-sm leading-6 text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 border-y border-white/[0.08] py-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">Open the current research queue.</h2>
            <p className="mt-2 text-sm text-slate-500">No trading automation. No custody. Just markets, estimates, and notes.</p>
          </div>
          <Link to="/edges" className="btn-secondary self-start sm:self-auto">
            Edge Board <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
