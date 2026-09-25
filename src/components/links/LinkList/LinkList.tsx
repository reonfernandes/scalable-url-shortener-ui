import type { ReactNode } from 'react'
import type { ClickCounts, ShortUrl } from '../../../api/types'
import { LinkListItem } from '../LinkListItem/LinkListItem'
import './LinkList.css'

interface LinkListProps {
  links: ShortUrl[]
  /** Clicks per urlId. Missing while they load or if analytics is unavailable. */
  clickCounts?: ClickCounts
  onEdit: (link: ShortUrl) => void
  onDelete: (link: ShortUrl) => void
  /** Shown under the list, e.g. pagination. */
  footer?: ReactNode
}

export function LinkList({ links, clickCounts, onEdit, onDelete, footer }: LinkListProps) {
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
          <LinkListItem
            key={link.urlId}
            link={link}
            clicks={clickCounts?.[link.urlId]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
      {footer}
    </section>
  )
}
