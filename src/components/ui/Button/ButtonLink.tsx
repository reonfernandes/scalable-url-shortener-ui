import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClassName, type ButtonStyleProps } from './buttonClassName'
import './Button.css'

interface ButtonLinkProps extends LinkProps, ButtonStyleProps {
  icon?: ReactNode
}

/** A router link that looks like a button. */
export function ButtonLink({ variant, size, fullWidth, iconOnly, icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClassName({ variant, size, fullWidth, iconOnly }, className)} {...rest}>
      {icon}
      {children}
    </Link>
  )
}
