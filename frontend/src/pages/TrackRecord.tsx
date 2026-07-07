import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { pct } from '@/lib/format'

interface TrackCall {
  market: string
  category: string
  research_probability: number
  market_probability: number
  edge_pts: number
  outcome: string
  correct: boolean
  confidence: string
  reported_at: string
}

interface TrackData {
  stats: Record<string, number>
  calls: TrackCall[]
}

export default function TrackRecord() {
  const [data, setData] = useState<TrackData | null>(null)

  useEffect(() => {
    api.get<TrackData>('/track-record').then(setData).catch(() => {})
  }, [])

  if (!data) return <div className="mx-auto max-w-7xl text-slate-500">Loading track record...</div>

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Calibration lab</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2.2rem,4.8vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
            Resolved calls stay on the record.
          </h1>
        </div>
        <section className="grid gap-2 sm:grid-cols-5">
          <Stat label="Resolved" value={String(data.stats.resolved_calls)} />
          <Stat label="Hit rate" value={pct(data.stats.hit_rate)} />
          <Stat label="High conf" value={pct(data.stats.high_confidence_hit_rate)} />
          <Stat label="Sim PnL" value={`${data.stats.simulated_pnl} pts`} />
          <Stat label="Avg win" value={`${data.stats.avg_edge_winners} pts`} />
        </section>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-5">
          <h2 className="text-xl font-semibold text-white">Calibration bands</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            The point is not a perfect score. The point is whether confidence bands behave like confidence bands after markets resolve.
          </p>
          <div className="mt-6 space-y-5">
            <Band label="50-60%" hit={0.5} count={2} />
            <Band label="60-70%" hit={1} count={1} />
            <Band label="70%+" hit={1} count={2} />
          </div>
        </div>

        <div className="space-y-3">
          {data.calls.map((call) => (
            <CallCard key={`${call.market}-${call.reported_at}`} call={call} />
          ))}
        </div>
      </section>

      <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-500">
        Reports are timestamped when created. Outcomes are tracked after resolution and are not edited retroactively.
      </p>
    </div>
  )
}

function CallCard({ call }: { call: TrackCall }) {
  const model = Math.round(call.research_probability * 100)
  const market = Math.round(call.market_probability * 100)

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr_0.22fr] lg:items-center">
        <div className="flex items-start gap-3">
          {call.correct ? (
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400/80" size={18} />
          ) : (
            <XCircle className="mt-0.5 shrink-0 text-red-300/80" size={18} />
          )}
          <div>
            <p className="font-medium leading-6 text-white">{call.market}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              {call.category} / {call.confidence} / outcome {call.outcome}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Market {market}%</span>
            <span>Research {model}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="absolute inset-y-0 left-0 bg-slate-400/55" style={{ width: `${market}%` }} />
            <div className="absolute inset-y-[-3px] w-px bg-white" style={{ left: `${model}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm lg:block lg:text-right">
          <span className="text-xs uppercase text-slate-500 lg:hidden">Edge</span>
          <span className={call.correct ? 'font-semibold text-emerald-300' : 'font-semibold text-red-300'}>
            {call.correct ? '+' : '-'}{call.edge_pts} pts
          </span>
        </div>
      </div>
    </article>
  )
}

function Band({ label, hit, count }: { label: string; hit: number; count: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{pct(hit)} hit / {count} calls</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full bg-slate-300" style={{ width: `${Math.round(hit * 100)}%` }} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-4">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
    </div>
  )
}
