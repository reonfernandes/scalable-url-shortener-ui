import type { ReactNode } from 'react'
import type { User } from '../../../api/types'
import { UserListItem } from '../UserListItem/UserListItem'
import './UserList.css'

interface UserListProps {
  users: User[]
  currentUserId: string | undefined
  /** userId of the row whose Activate request is running. */
  activatingId: string | null
  onDeactivate: (user: User) => void
  onActivate: (user: User) => void
  /** Shown under the list, e.g. pagination. */
  footer?: ReactNode
}

export function UserList({ users, currentUserId, activatingId, onDeactivate, onActivate, footer }: UserListProps) {
  return (
    <section className="user-list" aria-label="Users">
      <div className="user-list__head" aria-hidden="true">
        <span>User</span>
        <span>Role</span>
        <span>Status</span>
        <span>Joined</span>
        <span className="user-list__head-actions">Actions</span>
      </div>
      <ul className="user-list__items" role="list">
        {users.map((user) => (
          <UserListItem
            key={user.userId}
            user={user}
            isYou={user.userId === currentUserId}
            activating={user.userId === activatingId}
            onDeactivate={onDeactivate}
            onActivate={onActivate}
          />
        ))}
      </ul>
      {footer}
    </section>
  )
}
