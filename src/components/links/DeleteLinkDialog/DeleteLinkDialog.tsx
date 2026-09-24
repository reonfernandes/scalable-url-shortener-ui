import { useState } from 'react'
import { deleteUrl } from '../../../api/urlService'
import type { ShortUrl } from '../../../api/types'
import { parseApiError } from '../../../utils/errors'
import { getLinkTitle, stripProtocol } from '../../../utils/format'
import { Alert } from '../../ui/Alert/Alert'
import { Button } from '../../ui/Button/Button'
import { Dialog } from '../../ui/Dialog/Dialog'

interface DeleteLinkDialogProps {
  link: ShortUrl
  onClose: () => void
  onDeleted: () => void
}

export function DeleteLinkDialog({ link, onClose, onDeleted }: DeleteLinkDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      await deleteUrl(link.urlId)
      onDeleted()
    } catch (err) {
      setError(parseApiError(err, 'The link could not be deleted. Please try again.').message)
      setDeleting(false)
    }
  }

  return (
    <Dialog
      open
      size="sm"
      onClose={onClose}
      title="Delete this link?"
      description={
        <>
          <strong>{getLinkTitle(link)}</strong> ({stripProtocol(link.shortUrl)}) will stop working and its stats will
          no longer be shown. This can't be undone.
        </>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Delete link
          </Button>
        </>
      }
    >
      {error ? <Alert>{error}</Alert> : null}
    </Dialog>
  )
}
