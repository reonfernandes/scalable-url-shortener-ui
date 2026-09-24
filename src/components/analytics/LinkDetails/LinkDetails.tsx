import type { ShortUrl } from '../../../api/types'
import { formatDate } from '../../../utils/format'
import './LinkDetails.css'

export function LinkDetails({ link }: { link: ShortUrl }) {
  return (
    <dl className="link-details">
      <div className="link-details__item">
        <dt>Short code</dt>
        <dd className="link-details__mono">{link.shortCode}</dd>
      </div>
      <div className="link-details__item">
        <dt>Created</dt>
        <dd>{formatDate(link.createdAt)}</dd>
      </div>
      <div className="link-details__item">
        <dt>Expires</dt>
        <dd>{link.expiresOn ? formatDate(link.expiresOn) : 'Never'}</dd>
      </div>
      <div className="link-details__item">
        <dt>Password</dt>
        <dd>{link.isPasswordProtected ? 'On' : 'Off'}</dd>
      </div>
    </dl>
  )
}
