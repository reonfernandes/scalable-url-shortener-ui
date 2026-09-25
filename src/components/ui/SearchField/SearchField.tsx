import { useId, type InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import './SearchField.css'

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Read by screen readers; the placeholder is what people see. */
  label: string
}

export function SearchField({ label, className, id, ...rest }: SearchFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={['search-field', className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className="visually-hidden">
        {label}
      </label>
      <Search size={18} className="search-field__icon" aria-hidden="true" />
      <input id={inputId} type="search" className="search-field__input" {...rest} />
    </div>
  )
}
