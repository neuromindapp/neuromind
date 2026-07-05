import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, ShieldCheck, Wallet } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { shortWallet } from '@/lib/format'

type CreditPack = { credits: number; sol_amount: number; label: string }

export default function Account() {
  const auth = useAuth()
  const [account, setAccount] = useState<any>(null)
  const [intent, setIntent] = useState<any>(null)

  useEffect(() => {
    if (!auth.authenticated || !auth.user) return
    api.get('/account').then(setAccount).catch(() => {})
  }, [auth.authenticated, auth.user])

  if (!auth.authenticated) {
    return (
      <div className="mx-auto max-w-3xl pt-16 text-center">
        <Wallet className="mx-auto text-slate-300" size={32} />
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em]">Login to NeuroMind</h1>
        <p className="mt-4 text-slate-500">
          Wallet auth unlocks research credits, holder access, and account history.
        </p>
        <button onClick={auth.login} className="btn-primary mt-8" type="button">
          Login
        </button>
      </div>
    )
  }

  const buyCredits = async (credits: number) => {
    const next = await api.post('/payments/intent', { credits })
    setIntent(next)
  }

  const freeTries = account?.free_tries_left ?? auth.user?.free_tries_left ?? 0
  const credits = account?.credits ?? auth.user?.credits ?? 0
  const holderBalance = account?.holder?.balance ?? 0
  const holderThreshold = account?.holder?.threshold ?? 10000
  const holderPct = Math.min(100, Math.round((holderBalance / holderThreshold) * 100))
  const packs: CreditPack[] = account?.credit_packs || [
    { credits: 3, sol_amount: 0.075, label: 'Starter' },
    { credits: 10, sol_amount: 0.25, label: 'Research desk' },
    { credits: 25, sol_amount: 0.625, label: 'Lab' },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-8 rounded-2xl border border-white/[0.08] bg-[#090a0d] p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Account</p>
            <h1 className="mt-3 text-[clamp(2.2rem,4.8vw,4.6rem)] font-semibold leading-none tracking-[-0.045em]">
              {shortWallet(auth.walletAddress)}
            </h1>
            <p className="mt-4 text-sm text-slate-500">Credits, holder access, and report history for this wallet.</p>
          </div>
          <button className="btn-secondary self-start lg:self-auto" type="button">
            <RefreshCw size={14} /> Refresh holder
          </button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Panel label="Free reports" value={String(freeTries)} detail="Wallet trial balance" />
        <Panel label="Credits" value={String(credits)} detail="Paid report balance" />
        <Panel label="Holder daily" value={account?.holder?.daily_available ? 'Available' : 'Locked'} detail="10k+ $NEUROMIND required" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-slate-300" size={21} />
              <h2 className="text-2xl font-semibold">Holder access</h2>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-500">Detected $NEUROMIND</p>
                <p className="mt-1 text-3xl font-semibold">{holderBalance.toLocaleString()}</p>
              </div>
              <p className="text-sm text-slate-500">{holderThreshold.toLocaleString()} needed</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full bg-slate-300" style={{ width: `${holderPct}%` }} />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Hold 10k+ $NEUROMIND to receive one additional report unlock per day. Refresh after moving tokens.
            </p>
          </div>

          <HistoryBlock title="Usage history" rows={account?.usage || []} empty="No research reports consumed yet." />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-6">
            <h2 className="text-2xl font-semibold">Buy credits</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {packs.map((pack) => (
                <button
                  key={pack.credits}
                  onClick={() => buyCredits(pack.credits)}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.055]"
                  type="button"
                >
                  <p className="text-xs uppercase text-slate-500">{pack.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{pack.credits}</p>
                  <p className="mt-1 text-sm text-slate-500">{pack.sol_amount} SOL</p>
                </button>
              ))}
            </div>
            {intent && (
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm text-slate-500">
                <p className="font-medium text-white">Send {intent.sol_amount} SOL with this memo</p>
                <p className="mt-3 break-all">Treasury: {intent.treasury_wallet || 'set TREASURY_WALLET'}</p>
                <p className="mt-1 break-all">Memo: {intent.memo}</p>
              </div>
            )}
          </div>

          <HistoryBlock title="Payment history" rows={account?.payments || []} empty="No confirmed payments yet." />
        </div>
      </section>
    </div>
  )
}

function Panel({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-5">
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  )
}

function HistoryBlock({ title, rows, empty }: { title: string; rows: any[]; empty: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#090a0d] p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <History rows={rows} empty={empty} />
    </div>
  )
}

function History({ rows, empty }: { rows: any[]; empty: string }) {
  if (!rows.length) return <p className="mt-4 text-sm text-slate-500">{empty}</p>
  return (
    <div className="mt-4 space-y-2">
      {rows.map((row, index) => (
        <div key={row.memo || row.used_at || index} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            {row.report_path ? (
              <Link to={row.report_path} className="font-medium text-white transition-colors hover:text-slate-300">
                {row.question || row.source}
              </Link>
            ) : (
              <span className="font-medium text-white">{row.source || row.memo || `${row.credits_granted} credits`}</span>
            )}
            <span className="text-xs text-slate-500">{row.used_at || row.confirmed_at || 'pending'}</span>
          </div>
          {row.report_path && (
            <p className="mt-1 text-xs text-slate-500">
              {row.source} / {row.category}{row.edge_pts !== null && row.edge_pts !== undefined ? ` / ${row.edge_pts} pt edge` : ''}
            </p>
          )}
          {row.sol_amount && <p className="mt-1 text-xs text-slate-500">{row.sol_amount} SOL / {row.credits_granted} credits</p>}
        </div>
      ))}
    </div>
  )
}
