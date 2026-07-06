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
