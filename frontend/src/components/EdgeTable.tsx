import { Link } from 'react-router-dom'
import { ArrowUpRight, Lock } from 'lucide-react'
import { compactUsd, pct } from '@/lib/format'

export interface Edge {
  id: string
  question: string
  category: string
  market_probability: number
  research_probability: number
  edge_pts: number
  confidence: string
  resolution_risk: number
  volume: number
  resolves_at: string
  last_scanned_at: string
  direction: string
  preview: string
  yes_label?: string
  no_label?: string
}

export function EdgeTable({ edges }: { edges: Edge[] }) {
  if (!edges.length) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-8 text-sm text-slate-500">
        No markets match this research filter.
      </div>
    )
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {edges.map((edge) => (
        <ResearchCard key={edge.id} edge={edge} />
      ))}
    </div>
  )
}

function ResearchCard({ edge }: { edge: Edge }) {
  const market = Math.round(edge.market_probability * 100)
  const model = Math.round(edge.research_probability * 100)
  const delta = Math.abs(model - market)

  return (
    <Link
      to={`/report/${edge.id}`}
      className="group rounded-2xl border border-white/[0.08] bg-[#090a0d] p-5 transition-colors hover:border-white/20 hover:bg-[#0d0f13]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
          <span>{edge.category}</span>
          <span>/</span>
          <span>{edge.confidence}</span>
          <span>/</span>
          <span>{resolvesIn(edge.resolves_at)}</span>
        </div>
        <ArrowUpRight size={15} className="shrink-0 text-slate-500 transition-colors group-hover:text-white" />
      </div>

      <h3 className="mt-4 min-h-[3.5rem] text-base font-semibold leading-7 text-white">{edge.question}</h3>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <Metric label="Market" value={pct(edge.market_probability)} />
        <Metric label="Research" value={pct(edge.research_probability)} strong />
        <Metric label="Edge" value={`${edge.edge_pts} pts`} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>{edge.yes_label || 'YES'} {market}%</span>
          <span>{edge.no_label || 'NO'} {100 - market}%</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="absolute inset-y-0 left-0 bg-slate-400/55" style={{ width: `${market}%` }} />
          <div className="absolute inset-y-[-3px] w-px bg-white" style={{ left: `${model}%` }} />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Research estimate is {edge.direction === 'YES' ? 'above' : 'below'} the market by {delta} pts.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
        <p className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
          <Lock size={12} /> <span className="truncate">{edge.preview}</span>
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Risk {edge.resolution_risk}/10</span>
          <span>{compactUsd(edge.volume)}</span>
        </div>
      </div>
    </Link>
  )
}

function Metric({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={strong ? 'mt-1 text-xl font-semibold text-sky-100' : 'mt-1 text-xl font-semibold text-white'}>{value}</p>
    </div>
  )
}

function resolvesIn(value: string) {
  const days = Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 86400000))
  return `${days}d left`
}
