import { useState } from 'react'
import { ChevronLeft, ExternalLink, Globe, Link2Off, Pencil } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { getUrlStats } from '../../api/analyticsService'
import { findUrlByShortCode } from '../../api/urlService'
import type { ShortUrl } from '../../api/types'
import { BarList } from '../../components/analytics/BarList/BarList'
import { LinkDetails } from '../../components/analytics/LinkDetails/LinkDetails'
import { Seo } from '../../components/common/Seo/Seo'
import { LinkFormDialog } from '../../components/links/LinkFormDialog/LinkFormDialog'
import { Alert } from '../../components/ui/Alert/Alert'
import { Button } from '../../components/ui/Button/Button'
import { ButtonLink } from '../../components/ui/Button/ButtonLink'
import { Card } from '../../components/ui/Card/Card'
import { CopyButton } from '../../components/ui/CopyButton/CopyButton'
import { EmptyState } from '../../components/ui/EmptyState/EmptyState'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { ProtectedBadge, StatusBadge } from '../../components/ui/StatusBadge/StatusBadge'
import { useApiQuery } from '../../hooks/useApiQuery'
import { formatDate, formatNumber, getLinkStatus, getLinkTitle, isSafeHttpUrl, stripProtocol } from '../../utils/format'
import './LinkStatsPage.css'

const UNKNOWN_COUNTRY = 'Unknown'

export default function LinkStatsPage() {
  const { shortCode = '' } = useParams()
  const navigate = useNavigate()
  // The dashboard passes the link along, so the header shows straight away.
  const linkFromDashboard = (useLocation().state as { link?: ShortUrl } | null)?.link
  const [editing, setEditing] = useState(false)

  const linkQuery = useApiQuery((signal) => findUrlByShortCode(shortCode, signal), `link:${shortCode}`)
  const statsQuery = useApiQuery((signal) => getUrlStats(shortCode, signal), `stats:${shortCode}`)

  const link =
    linkQuery.data !== undefined
      ? linkQuery.data
      : linkFromDashboard?.shortCode === shortCode
        ? linkFromDashboard
        : undefined
  const stats = statsQuery.data

  if (link === null) {
    return (
      <div className="link-stats">
        <Seo title="Link not found" noIndex />
        <EmptyState
          icon={<Link2Off size={22} aria-hidden="true" />}
          title="Link not found"
          action={
            <ButtonLink to="/dashboard" variant="dark">
              Back to your links
            </ButtonLink>
          }
        >
          This link doesn't exist or doesn't belong to your account.
        </EmptyState>
      </div>
    )
  }

  if (!link) {
    return linkQuery.error ? <Alert>{linkQuery.error.message}</Alert> : <Spinner label="Loading link" />
  }

  const title = getLinkTitle(link)
  const countries = Object.fromEntries(
    Object.entries(stats?.clicksByCountry ?? {}).filter(([name]) => name !== UNKNOWN_COUNTRY),
  )

  return (
    <div className="link-stats">
      <Seo title={`Stats for ${title}`} noIndex />

      <Link to="/dashboard" className="link-stats__back">
        <ChevronLeft size={16} aria-hidden="true" />
        All links
      </Link>

      <div className="link-stats__header">
        <div className="link-stats__heading">
          <h1 className="link-stats__title">{title}</h1>
          <div className="link-stats__short">
            <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="link-stats__short-url">
              {stripProtocol(link.shortUrl)}
            </a>
            <CopyButton text={link.shortUrl} variant="secondary" />
            <StatusBadge status={getLinkStatus(link)} />
            {link.isPasswordProtected && <ProtectedBadge />}
          </div>
          <p className="link-stats__destination">
            <span>Goes to</span>
            {isSafeHttpUrl(link.longUrl) ? (
              <a href={link.longUrl} target="_blank" rel="noopener noreferrer" className="link-stats__long-url">
                <span>{link.longUrl}</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            ) : (
              <span className="link-stats__long-url">{link.longUrl}</span>
            )}
          </p>
        </div>
        <Button variant="secondary" onClick={() => setEditing(true)} icon={<Pencil size={16} aria-hidden="true" />}>
          Edit link
        </Button>
      </div>

      {statsQuery.error && <Alert>{statsQuery.error.message}</Alert>}

      <div className="link-stats__grid">
        <Card title="Total clicks" quietTitle>
          <div className="link-stats__total">
            <span className="link-stats__total-value">
              {stats ? formatNumber(stats.totalClicks) : '—'}
            </span>
            <span className="link-stats__total-since">Since {formatDate(link.createdAt)}</span>
          </div>
        </Card>

        <Card title="Link details" quietTitle className="link-stats__details">
          <LinkDetails link={link} />
        </Card>

        <Card title="Clicks by browser">
          {!stats ? (
            <Spinner />
          ) : stats.totalClicks === 0 ? (
            <p className="link-stats__no-data">No clicks yet.</p>
          ) : (
            <BarList data={stats.clicksByBrowser} />
          )}
        </Card>

        <Card title="Clicks by operating system">
          {!stats ? (
            <Spinner />
          ) : stats.totalClicks === 0 ? (
            <p className="link-stats__no-data">No clicks yet.</p>
          ) : (
            <BarList data={stats.clicksByOs} />
          )}
        </Card>

        <Card title="Clicks by country">
          {!stats ? (
            <Spinner />
          ) : Object.keys(countries).length > 0 ? (
            <BarList data={countries} />
          ) : (
            <EmptyState icon={<Globe size={22} aria-hidden="true" />} title="Not tracked yet">
              Location lookup isn't turned on, so clicks don't have a country yet.
            </EmptyState>
          )}
        </Card>
      </div>

      {editing && (
        <LinkFormDialog
          mode="edit"
          link={link}
          onClose={() => setEditing(false)}
          onSaved={(changes) => {
            setEditing(false)
            // A new alias means a new address for this page.
            if (changes.customAlias) navigate(`/links/${encodeURIComponent(changes.customAlias)}`, { replace: true })
            else linkQuery.reload()
          }}
        />
      )}
    </div>
  )
}
