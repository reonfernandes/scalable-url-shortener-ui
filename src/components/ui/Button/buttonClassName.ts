export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'
export type ButtonSize = 'sm' | 'md'

export interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  iconOnly?: boolean
}

/** Shared by Button and ButtonLink so both look the same. */
export function buttonClassName(
  { variant = 'primary', size = 'md', fullWidth = false, iconOnly = false }: ButtonStyleProps,
  extra?: string,
): string {
  return [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full',
    iconOnly && 'button--icon-only',
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}
