import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowUpRight, Lock, Unlock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { compactUsd, pct } from '@/lib/format'

interface ReportPayload {
  locked: boolean
  report: any
}

export default function Report() {
  const { id } = useParams()
  const navigate = useNavigate()
  const auth = useAuth()
  const [payload, setPayload] = useState<ReportPayload | null>(null)
  const [error, setError] = useState('')
  const [unlocking, setUnlocking] = useState(false)

  useEffect(() => {
    if (!id) return
    setPayload(null)
    setError('')
    api.get<ReportPayload>(`/reports/${id}`).then(setPayload).catch((err) => setError(err.message))
  }, [id, auth.user?.id])

  if (error) return <div className="mx-auto max-w-4xl text-red-300">{error}</div>
  if (!payload) return <div className="mx-auto max-w-4xl text-slate-500">Loading report...</div>

  const report = payload.report

  const unlockReport = async () => {
    if (!id) return
    if (!auth.authenticated) {
      auth.login()
      return
    }
    setUnlocking(true)
    setError('')
    try {
      const next = await api.post<ReportPayload & { quota_source: string }>(`/reports/${id}/unlock`)
      setPayload({ locked: false, report: next.report })
      if (next.report.id && next.report.id !== id) navigate(`/report/${next.report.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not unlock report')
    } finally {
      setUnlocking(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{report.category} / {report.confidence}</p>
          <h1 className="mt-3 max-w-4xl text-[clamp(2rem,4vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
            {report.question}
          </h1>
        </div>
        <a href={report.polymarket_url} target="_blank" rel="noreferrer" className="btn-secondary self-start lg:self-auto">
          Open Polymarket <ArrowUpRight size={16} />
        </a>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <ProbabilityCard report={report} />
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Metric label="Edge" value={`${report.edge_pts} pts`} />
          <Metric label="Resolution risk" value={`${report.resolution_risk}/10`} />
          <Metric label="Volume" value={compactUsd(report.volume || 0)} />
        </div>
      </section>

      {payload.locked ? (
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#090a0d] p-7">
          <div className="flex items-center gap-3 text-slate-300">
            <Lock size={18} />
            <span className="text-sm font-semibold uppercase tracking-[0.12em]">Report locked</span>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
            {report.preview} Unlock the full reasoning, source review, rule wording risk, and estimate history with one report credit.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button onClick={unlockReport} disabled={unlocking || auth.isLoading} className="btn-primary disabled:opacity-60" type="button">
              <Unlock size={16} /> {auth.authenticated ? (unlocking ? 'Unlocking...' : 'Unlock report') : 'Login to unlock'}
            </button>
            <Link to="/edges" className="btn-secondary">Back to board</Link>
          </div>
        </section>
      ) : (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Analysis brief</p>
            <h2 className="mt-2 text-2xl font-semibold">Reasoning</h2>
            <p className="mt-4 whitespace-pre-line leading-8 text-slate-400">{report.reasoning}</p>
            <div className="mt-6 space-y-3">
              {report.key_drivers.map((driver: string) => (
                <p key={driver} className="border-l border-white/15 pl-4 text-sm leading-6 text-slate-500">{driver}</p>
              ))}
            </div>
