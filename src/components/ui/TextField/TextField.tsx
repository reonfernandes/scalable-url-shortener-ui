import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './TextField.css'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string
  /** Extra help shown under the field. */
  hint?: ReactNode
  /** Error message; also marks the field as invalid for screen readers. */
  error?: string
  /** Fixed text shown before the input, e.g. "microurl.ly/". */
  prefix?: string
  /** For password fields: adds a button to show or hide the value. */
  revealable?: boolean
  optional?: boolean
  mono?: boolean
}

export function TextField({
  label,
  hint,
  error,
  prefix,
  revealable = false,
  optional = false,
  mono = false,
  id,
  type = 'text',
  className,
  ...rest
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const [revealed, setRevealed] = useState(false)

  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined
  const inputType = revealable && revealed ? 'text' : type

  return (
    <div className={['text-field', error && 'text-field--invalid', className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className="text-field__label">
        {label}
        {optional && <span className="text-field__optional"> (optional)</span>}
      </label>
      <div className="text-field__control">
        {prefix && (
          <span className="text-field__prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type={inputType}
          className={['text-field__input', mono && 'text-field__input--mono'].filter(Boolean).join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {revealable && (
          <button
            type="button"
            className="text-field__reveal"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
          >
            {revealed ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        )}
      </div>
      {hint && (
        <div id={hintId} className="text-field__hint">
          {hint}
        </div>
      )}
      {error && (
        <p id={errorId} className="text-field__error">
          {error}
        </p>
      )}
    </div>
  )
}
