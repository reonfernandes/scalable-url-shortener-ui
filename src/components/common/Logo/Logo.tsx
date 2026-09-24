import { Link2 } from 'lucide-react'
import { Link } from 'react-router'
import './Logo.css'

interface LogoProps {
  /** Use "light" on dark backgrounds. */
  tone?: 'dark' | 'light'
  size?: 'sm' | 'md'
  /** Makes the logo a link to this path. */
  to?: string
}

export function Logo({ tone = 'dark', size = 'md', to }: LogoProps) {
  const content = (
    <>
      <span className="logo__mark" aria-hidden="true">
        <Link2 size={size === 'sm' ? 14 : 18} strokeWidth={2.25} />
      </span>
      <span className="logo__text">microurl</span>
    </>
  )
  const className = `logo logo--${tone} logo--${size}`

  return to ? (
    <Link to={to} className={className} aria-label="microurl home">
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  )
}
