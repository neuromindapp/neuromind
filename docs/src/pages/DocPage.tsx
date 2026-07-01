import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

type Section = {
  id: string
  title: string
  body?: string[]
  bullets?: string[]
  cards?: Array<{ title: string; body: string; color: string; rgb: string }>
}

export type Doc = {
  path: string
  eyebrow: string
  title: string
  lede: string
  sections: Section[]
  next?: Array<{ to: string; label: string; desc: string }>
}

const blue = { color: '#dbeafe', rgb: '219, 234, 254' }
const dark = { color: '#94a3b8', rgb: '148, 163, 184' }

export const docs: Doc[] = [
  {
    path: '/',
    eyebrow: 'Documentation',
    title: 'NeuroMind',
    lede: 'A user guide for reading Polymarket edges, unlocking reports, and judging research estimates.',
    sections: [
      {
        id: 'what-it-is',
        title: 'What NeuroMind does',
        body: [
          'NeuroMind helps you find Polymarket markets where the displayed odds may be wrong. It compares market prices against research probability estimates, then highlights the largest divergences as potential edges.',
          'NeuroMind does not place bets for you. It gives you research, sources, resolution-risk notes, and direct Polymarket links so you can make your own decision.',
        ],
      },
      {
        id: 'main-surfaces',
        title: 'Main surfaces',
        cards: [
          { title: 'Edge Board', body: 'Browse public market rankings by odds, research estimate, edge size, confidence, volume, and rule risk.', ...blue },
          { title: 'Reports', body: 'Unlock the full reasoning behind one market, including key drivers, sources, and settlement wording risks.', ...dark },
          { title: 'Track Record', body: 'Review resolved calls with wins, losses, hit rate, simulated PnL, and calibration context.', ...blue },
          { title: 'Account', body: 'Check free dives, holder daily access, credits, payment status, and usage history.', ...dark },
        ],
      },
      {
        id: 'how-to-use-it',
        title: 'How to use it',
        bullets: [
          'Open the Edge Board and sort by edge points to see the strongest divergences first.',
          'Check confidence and resolution risk before deciding whether the edge is worth deeper research.',
          'Unlock a report only when the preview and market setup are relevant to you.',
          'Use the Polymarket link inside the report if you want to trade directly on Polymarket.',
          'Review the Track Record regularly so you know how research estimates have performed after resolution.',
        ],
      },
    ],
    next: [
      { to: '/edge-board', label: 'Edge Board', desc: 'How to read the market ranking table.' },
      { to: '/reports', label: 'Reports', desc: 'What you get when you unlock a report.' },
      { to: '/access-model', label: 'Access Model', desc: 'Free tries, holder dailies, and paid credits.' },
    ],
  },
  {
    path: '/getting-started',
    eyebrow: 'Guide',
    title: 'Getting Started',
    lede: 'The fastest path from first visit to reading your first unlocked report.',
    sections: [
      {
        id: 'first-visit',
        title: 'First visit',
        body: [
          'You can browse the Edge Board and Track Record without connecting a wallet. This lets you inspect live market rankings, see example previews, and judge whether the product is useful before unlocking anything.',
          'A wallet is only needed when you want to unlock full report reasoning, use free dives, use holder access, or buy credits.',
        ],
      },
      {
        id: 'connect-wallet',
        title: 'Connect a Solana wallet',
        body: [
          'Use the Login button in the app header. NeuroMind supports Solana wallets only. Your wallet is used for login, quota ownership, holder checks, and SOL credit payments.',
          'NeuroMind does not ask for private keys and does not place trades from your wallet.',
        ],
      },
      {
        id: 'first-report',
        title: 'Unlock your first report',
        bullets: [
          'Choose a market from the Edge Board.',
          'Read the public preview, odds, research estimate, confidence, and resolution risk.',
          'Open the report page and unlock it with an available free dive, holder daily, or credit.',
          'Read the reasoning and sources, then decide independently whether to act on Polymarket.',
        ],
      },
    ],
  },
  {
    path: '/access-model',
    eyebrow: 'Access',
    title: 'Access Model',
    lede: 'The board is free to browse. Full report reasoning is the paid or quota-gated resource.',
    sections: [
      {
        id: 'what-is-free',
        title: 'What is free',
        body: [
          'Anyone can view the Edge Board, market questions, public odds, research estimates, edge points, confidence, resolution risk, volume, freshness, and locked report previews.',
          'The Track Record is also public so users can judge resolved calls without connecting a wallet.',
        ],
      },
      {
        id: 'unlock-options',
        title: 'Unlock options',
        bullets: [
          'First wallet connection: 5 lifetime reports.',
          '10k+ $NEUROMIND holders: 1 additional report per day.',
          'Paid credits: buy report credits with SOL after free access is used.',
        ],
      },
      {
        id: 'quota-priority',
        title: 'Quota priority',
        body: [
          'When you unlock a report, NeuroMind first checks for an available holder daily, then remaining free dives, then paid credits. If none are available, the app shows the payment flow.',
          'Holder daily access resets at 00:00 UTC. Free dives are lifetime per wallet and do not reset.',
        ],
      },
      {
        id: 'locked-previews',
        title: 'Locked previews',
        body: [
          'Locked reports show enough context to decide whether the market is interesting, but the full reasoning, source list, and detailed resolution-risk notes remain unavailable until unlock.',
          'This keeps the paid report valuable while still letting users compare markets before spending a quota unit.',
        ],
      },
    ],
  },
  {
    path: '/edge-board',
