import { LoaderCircle } from 'lucide-react'
import './Spinner.css'

interface SpinnerProps {
  label?: string
  /** Fills the screen, for the first load of a page. */
  fullPage?: boolean
}

export function Spinner({ label = 'Loading', fullPage = false }: SpinnerProps) {
  return (
    <div className={fullPage ? 'spinner spinner--full-page' : 'spinner'} role="status">
      <LoaderCircle className="spinner__icon" size={28} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  )
}
