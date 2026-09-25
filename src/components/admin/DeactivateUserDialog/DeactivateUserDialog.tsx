import { useState } from 'react'
import { UserX } from 'lucide-react'
import { deactivateUser } from '../../../api/adminService'
import type { User } from '../../../api/types'
import { parseApiError } from '../../../utils/errors'
import { Alert } from '../../ui/Alert/Alert'
import { Button } from '../../ui/Button/Button'
import { Dialog } from '../../ui/Dialog/Dialog'
import './DeactivateUserDialog.css'

interface DeactivateUserDialogProps {
  user: User
  onClose: () => void
  onDeactivated: (user: User) => void
}

export function DeactivateUserDialog({ user, onClose, onDeactivated }: DeactivateUserDialogProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleDeactivate = async () => {
    setSaving(true)
    setError('')
    try {
      await deactivateUser(user.userId)
      onDeactivated(user)
    } catch (err) {
      setError(parseApiError(err, 'The user could not be deactivated. Please try again.').message)
      setSaving(false)
    }
  }

  return (
    <Dialog
      open
      size="sm"
      onClose={onClose}
      icon={
        <span className="deactivate-dialog__icon">
          <UserX size={22} aria-hidden="true" />
        </span>
      }
      title={`Deactivate ${user.name}?`}
      description={<span className="deactivate-dialog__email">{user.email}</span>}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeactivate} loading={saving}>
            Deactivate user
          </Button>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      <ul className="deactivate-dialog__effects" role="list">
        <li>They are logged out right away and can't log in.</li>
        <li>All their short links stop working for visitors.</li>
        <li className="deactivate-dialog__undo">Nothing is deleted. Activate them again to undo this.</li>
      </ul>
    </Dialog>
  )
}
