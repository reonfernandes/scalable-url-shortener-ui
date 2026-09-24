import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import './Alert.css'

interface AlertProps {
  tone?: 'error' | 'success'
  children: ReactNode
}

/** A message box that screen readers announce as soon as it appears. */
export function Alert({ tone = 'error', children }: AlertProps) {
  const Icon = tone === 'error' ? CircleAlert : CircleCheck
  return (
    <div className={`alert alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon size={18} className="alert__icon" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}
