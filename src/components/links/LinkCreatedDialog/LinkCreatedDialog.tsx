import { Check } from 'lucide-react'
import type { ShortUrl } from '../../../api/types'
import { stripProtocol } from '../../../utils/format'
import { Button } from '../../ui/Button/Button'
import { CopyButton } from '../../ui/CopyButton/CopyButton'
import { Dialog } from '../../ui/Dialog/Dialog'
import './LinkCreatedDialog.css'

interface LinkCreatedDialogProps {
  link: ShortUrl
  onClose: () => void
  onCreateAnother: () => void
}

export function LinkCreatedDialog({ link, onClose, onCreateAnother }: LinkCreatedDialogProps) {
  return (
    <Dialog
      open
      size="sm"
      onClose={onClose}
      title="Your link is ready"
      description="Share it anywhere. Every click shows up in its stats."
      icon={
        <span className="link-created__icon" aria-hidden="true">
          <Check size={24} strokeWidth={2.5} />
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onCreateAnother}>
            Create another
          </Button>
          <Button variant="dark" onClick={onClose}>
            Done
          </Button>
        </>
      }
    >
      <div className="link-created">
        <div className="link-created__box">
          <span className="link-created__short-url">{stripProtocol(link.shortUrl)}</span>
          <CopyButton text={link.shortUrl} withLabel variant="primary" />
        </div>
        <p className="link-created__destination">
          <span>Goes to</span>
          <span className="link-created__long-url" title={link.longUrl}>
            {link.longUrl}
          </span>
        </p>
      </div>
    </Dialog>
  )
}
