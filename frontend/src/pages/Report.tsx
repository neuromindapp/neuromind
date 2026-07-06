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
