import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export const CONTRACT_ADDRESS = 'TEZRfLHPRzEQTdSVdxRuAgbuzpKXj9V15KzYYispump'

type ContractAddressProps = {
  variant?: 'hero' | 'footer'
}

export function ContractAddress({ variant = 'hero' }: ContractAddressProps) {
  const [copied, setCopied] = useState(false)
  const compact = variant === 'footer'

  async function copyAddress() {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div
      className={[
        'inline-flex max-w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] text-left',
        compact ? 'px-3 py-2' : 'px-3 py-2.5 sm:px-4',
      ].join(' ')}
    >
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">CA</p>
        <p className={['break-all font-mono text-slate-300', compact ? 'text-[11px]' : 'text-xs sm:text-[13px]'].join(' ')}>
          {CONTRACT_ADDRESS}
        </p>
      </div>
      <button
        type="button"
        onClick={copyAddress}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
        aria-label="Copy contract address"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}
