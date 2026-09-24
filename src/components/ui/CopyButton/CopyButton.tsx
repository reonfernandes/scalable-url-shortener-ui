import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { Button } from '../Button/Button'
import type { ButtonVariant } from '../Button/buttonClassName'
import './CopyButton.css'

interface CopyButtonProps {
  text: string
  /** Shows "Copy" next to the icon; otherwise only the icon is shown. */
  withLabel?: boolean
  variant?: ButtonVariant
  size?: 'sm' | 'md'
}

export function CopyButton({ text, withLabel = false, variant = 'ghost', size = 'sm' }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard()
  const Icon = copied ? Check : Copy

  return (
    <>
      <Button
        variant={variant}
        size={size}
        iconOnly={!withLabel}
        className="copy-button"
        onClick={() => copy(text)}
        aria-label={withLabel ? undefined : copied ? 'Copied' : 'Copy short link'}
        icon={<Icon size={16} aria-hidden="true" />}
      >
        {withLabel && (copied ? 'Copied' : 'Copy')}
      </Button>
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </>
  )
}
