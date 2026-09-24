import { Lock } from 'lucide-react'
import type { LinkStatus } from '../../../utils/format'
import './StatusBadge.css'

const LABELS: Record<LinkStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  inactive: 'Inactive',
}

export function StatusBadge({ status }: { status: LinkStatus }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {LABELS[status]}
    </span>
  )
}

export function ProtectedBadge() {
  return (
    <span className="status-badge status-badge--protected">
      <Lock size={12} strokeWidth={2.25} aria-hidden="true" />
      Protected
    </span>
  )
}
