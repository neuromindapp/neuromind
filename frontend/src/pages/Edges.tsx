import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Edge, EdgeTable } from '@/components/EdgeTable'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'

const filters = ['all', 'politics', 'crypto', 'econ', 'culture', 'science']

export default function Edges() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [edges, setEdges] = useState<Edge[]>([])
  const [query, setQuery] = useState('')
  const [confidence, setConfidence] = useState('all')
  const [domain, setDomain] = useState('all')
  const [lastScan, setLastScan] = useState('')
  const [isRunningDive, setIsRunningDive] = useState(false)
  const [diveError, setDiveError] = useState('')

  useEffect(() => {
    api.get<{ last_scan_cycle: string; edges: Edge[] }>('/edges')
      .then((data) => {
        setEdges(data.edges)
        setLastScan(data.last_scan_cycle)
      })
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    return edges
      .filter((edge) => edge.question.toLowerCase().includes(query.toLowerCase()) || edge.category.includes(query.toLowerCase()))
      .filter((edge) => confidence === 'all' || edge.confidence === confidence)
      .filter((edge) => domain === 'all' || edge.category === domain)
      .sort((a, b) => b.edge_pts - a.edge_pts)
  }, [edges, query, confidence, domain])

  const stats = useMemo(() => {
    const avgEdge = edges.length ? Math.round(edges.reduce((sum, edge) => sum + edge.edge_pts, 0) / edges.length) : 0
    const highConfidence = edges.filter((edge) => edge.confidence === 'high').length
    const highRisk = edges.filter((edge) => edge.resolution_risk >= 7).length
    return [
      ['Scanned', String(edges.length)],
      ['Avg edge', `${avgEdge} pts`],
      ['High confidence', String(highConfidence)],
      ['High rule risk', String(highRisk)],
    ]
  }, [edges])

  const runDive = async () => {
    const input = query.trim()
    if (!input) return
    if (!auth.authenticated) {
      auth.login()
      return
    }
    setIsRunningDive(true)
    setDiveError('')
    try {
      const result = await api.post<{ report_id: string }>('/dives', { market_url_or_query: input })
      navigate(`/report/${result.report_id}`)
    } catch (err) {
      setDiveError(err instanceof Error ? err.message : 'Could not start analysis')
    } finally {
      setIsRunningDive(false)
    }
  }

  const showDiveCta = query.trim().length > 2

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Research queue</p>
          <h1 className="mt-3 max-w-2xl text-[clamp(2.2rem,4.8vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
            Markets with measurable disagreement.
          </h1>
          <p className="mt-4 text-sm text-slate-500">Last scan cycle: {lastScan || 'loading'}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-4">
              <p className="text-xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mb-5 rounded-2xl border border-white/[0.08] bg-[#090a0d] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3">
            <Search size={15} className="text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a subject or paste a Polymarket URL"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setDomain(item)}
                className={[
                  'h-9 rounded-lg px-3 text-xs font-medium capitalize transition-colors',
                  domain === item ? 'bg-white text-black' : 'border border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white',
                ].join(' ')}
                type="button"
              >
                {item}
              </button>
            ))}
            <select
              value={confidence}
              onChange={(event) => setConfidence(event.target.value)}
              className="h-9 rounded-lg border border-white/[0.08] bg-black/30 px-3 text-xs text-slate-300 outline-none"
            >
              <option value="all">All confidence</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </section>

      {showDiveCta && (
        <section className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#090a0d] p-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-white">Run a focused analysis on this market.</p>
            <p className="mt-1 text-sm text-slate-500">
              NeuroMind will build a structured brief from the query or Polymarket URL.
            </p>
            {diveError && <p className="mt-2 text-sm text-red-300">{diveError}</p>}
          </div>
          <button onClick={runDive} disabled={isRunningDive} className="btn-primary shrink-0 disabled:opacity-60" type="button">
            {auth.authenticated ? (isRunningDive ? 'Running analysis...' : 'Run analysis') : 'Login to run analysis'} <ArrowRight size={15} />
          </button>
        </section>
      )}

      <EdgeTable edges={filtered} />
    </div>
  )
}
