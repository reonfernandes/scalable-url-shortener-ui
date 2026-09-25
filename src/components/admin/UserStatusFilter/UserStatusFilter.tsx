import type { UserStatusFilter as Status } from '../../../api/types'
import './UserStatusFilter.css'

const OPTIONS: { value: Status; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'deactivated', label: 'Deactivated' },
]

interface UserStatusFilterProps {
  value: Status
  onChange: (value: Status) => void
}

/** All / Active / Deactivated switch above the user list. */
export function UserStatusFilter({ value, onChange }: UserStatusFilterProps) {
  return (
    <div className="status-filter" role="group" aria-label="Filter by status">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="status-filter__option"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
