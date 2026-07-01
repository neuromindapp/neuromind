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
