export function pct(value: number) {
  return `${Math.round(value * 100)}%`
}

export function compactUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function shortWallet(address: string | null) {
  return address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ''
}

