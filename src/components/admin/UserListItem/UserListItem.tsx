import { memo } from 'react'
import { ShieldCheck } from 'lucide-react'
import type { User } from '../../../api/types'
import { formatDate, getInitials } from '../../../utils/format'
import { isAdmin } from '../../../utils/roles'
import { Button } from '../../ui/Button/Button'
import '../../ui/StatusBadge/StatusBadge.css'
import './UserListItem.css'

interface UserListItemProps {
  user: User
  /** The logged-in admin's own row: no action, so they can't lock themselves out. */
  isYou: boolean
  /** True while this row's Activate request runs. */
  activating: boolean
  onDeactivate: (user: User) => void
  onActivate: (user: User) => void
}

/** One row of the users table (a card on small screens). Memoised so other rows don't re-render. */
export const UserListItem = memo(function UserListItem({
  user,
  isYou,
  activating,
  onDeactivate,
  onActivate,
}: UserListItemProps) {
  return (
    <li className="user-item">
      <div className="user-item__main">
        <span className="user-item__avatar" aria-hidden="true">
          {getInitials(user.name)}
        </span>
        <div className="user-item__text">
          <span className="user-item__name">
            {user.name}
            {isYou && <span className="user-item__you">You</span>}
          </span>
          <span className="user-item__email">{user.email}</span>
        </div>
      </div>

      <span className="user-item__role">
        {isAdmin(user) ? (
          <span className="user-item__role-badge user-item__role-badge--admin">
            <ShieldCheck size={13} strokeWidth={2.25} aria-hidden="true" />
            Admin
          </span>
        ) : (
          <span className="user-item__role-badge">User</span>
        )}
      </span>

      <span className="user-item__status">
        {user.active ? (
          <span className="status-badge status-badge--active">
            <span className="status-badge__dot" aria-hidden="true" />
            Active
          </span>
        ) : (
          <span className="status-badge status-badge--inactive">
            <span className="status-badge__dot" aria-hidden="true" />
            Deactivated
          </span>
        )}
      </span>

      <span className="user-item__joined">
        <span className="visually-hidden">Joined </span>
        {formatDate(user.createdAt)}
      </span>

      <div className="user-item__actions">
        {isYou ? null : user.active ? (
          <Button
            variant="secondary"
            size="sm"
            className="user-item__deactivate"
            onClick={() => onDeactivate(user)}
            aria-label={`Deactivate ${user.name}`}
          >
            Deactivate
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            loading={activating}
            onClick={() => onActivate(user)}
            aria-label={`Activate ${user.name}`}
          >
            Activate
          </Button>
        )}
      </div>
    </li>
  )
})
