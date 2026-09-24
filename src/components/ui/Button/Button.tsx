import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { buttonClassName, type ButtonStyleProps } from './buttonClassName'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {
  /** Shows a spinner and disables the button while an action runs. */
  loading?: boolean
  icon?: ReactNode
}

export function Button({
  variant,
  size,
  fullWidth,
  iconOnly,
  loading = false,
  icon,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth, iconOnly }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <LoaderCircle className="button__spinner" size={18} aria-hidden="true" /> : icon}
      {children}
    </button>
  )
}
