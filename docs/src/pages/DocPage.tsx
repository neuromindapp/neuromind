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
