import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import './Dialog.css'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  /** Buttons shown at the bottom. */
  footer?: ReactNode
  children?: ReactNode
  size?: 'sm' | 'md'
  /** Shown above the title, e.g. a success icon. */
  icon?: ReactNode
}

/**
 * A modal built on the native <dialog> element, which traps focus,
 * closes on Escape and returns focus to the opener for us.
 */
export function Dialog({ open, onClose, title, description, footer, children, size = 'md', icon }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={`dialog dialog--${size}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        // Escape key: let React state decide when the dialog closes.
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {open && (
        <div className="dialog__panel">
          <header className="dialog__header">
            <div className="dialog__heading">
              {icon}
              <h2 id={titleId} className="dialog__title">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="dialog__description">
                  {description}
                </p>
              )}
            </div>
            <button type="button" className="dialog__close" onClick={onClose} aria-label="Close">
              <X size={18} aria-hidden="true" />
            </button>
          </header>
          {children && <div className="dialog__body">{children}</div>}
          {footer && <footer className="dialog__footer">{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
