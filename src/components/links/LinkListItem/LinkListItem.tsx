import { memo } from 'react'
import { ChartColumn, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import type { ShortUrl } from '../../../api/types'
import { formatDate, formatNumber, getLinkStatus, getLinkTitle, stripProtocol } from '../../../utils/format'
import { Button } from '../../ui/Button/Button'
import { CopyButton } from '../../ui/CopyButton/CopyButton'
import { ProtectedBadge, StatusBadge } from '../../ui/StatusBadge/StatusBadge'
import './LinkListItem.css'

interface LinkListItemProps {
  link: ShortUrl
  onEdit: (link: ShortUrl) => void
  onDelete: (link: ShortUrl) => void
}

/** One row of the links table (a card on small screens). Memoised so other rows don't re-render. */
export const LinkListItem = memo(function LinkListItem({ link, onEdit, onDelete }: LinkListItemProps) {
  const title = getLinkTitle(link)
  const statsPath = `/links/${encodeURIComponent(link.shortCode)}`

  return (
    <li className="link-item">
      <div className="link-item__main">
        <Link to={statsPath} state={{ link }} className="link-item__title">
          {title}
        </Link>
        <div className="link-item__short">
          <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="link-item__short-url">
            {stripProtocol(link.shortUrl)}
          </a>
          <CopyButton text={link.shortUrl} />
        </div>
        <span className="link-item__long-url" title={link.longUrl}>
          {link.longUrl}
        </span>
      </div>

      <span className="link-item__clicks">
        {formatNumber(link.clickCount)}
        <span className="link-item__clicks-label"> clicks</span>
      </span>

      <div className="link-item__status">
        <StatusBadge status={getLinkStatus(link)} />
        {link.isPasswordProtected && <ProtectedBadge />}
      </div>

      <span className="link-item__created">
        <span className="visually-hidden">Created </span>
        {formatDate(link.createdAt)}
      </span>

      <div className="link-item__actions">
        <Link to={statsPath} state={{ link }} className="link-item__action" aria-label={`View stats for ${title}`}>
          <ChartColumn size={18} aria-hidden="true" />
        </Link>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          onClick={() => onEdit(link)}
          aria-label={`Edit ${title}`}
          icon={<Pencil size={17} aria-hidden="true" />}
        />
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          className="link-item__delete"
          onClick={() => onDelete(link)}
          aria-label={`Delete ${title}`}
          icon={<Trash2 size={17} aria-hidden="true" />}
        />
      </div>
    </li>
  )
})
