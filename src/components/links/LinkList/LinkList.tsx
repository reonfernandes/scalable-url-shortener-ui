import type { ReactNode } from 'react'
import type { ShortUrl } from '../../../api/types'
import { LinkListItem } from '../LinkListItem/LinkListItem'
import './LinkList.css'

interface LinkListProps {
  links: ShortUrl[]
  onEdit: (link: ShortUrl) => void
  onDelete: (link: ShortUrl) => void
  /** Shown under the list, e.g. pagination. */
  footer?: ReactNode
}

export function LinkList({ links, onEdit, onDelete, footer }: LinkListProps) {
  return (
    <section className="link-list" aria-label="Your links">
      <div className="link-list__head" aria-hidden="true">
        <span>Link</span>
        <span>Clicks</span>
        <span>Status</span>
        <span>Created</span>
        <span className="link-list__head-actions">Actions</span>
      </div>
      <ul className="link-list__items" role="list">
        {links.map((link) => (
          <LinkListItem key={link.urlId} link={link} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
      {footer}
    </section>
  )
}
