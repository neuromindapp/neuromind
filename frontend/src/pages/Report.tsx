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
