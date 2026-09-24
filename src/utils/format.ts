import type { ShortUrl } from '../api/types'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const numberFormatter = new Intl.NumberFormat('en-US')

/** "2026-09-24T10:15:30" -> "Sep 24, 2026". The backend sends local times without a zone. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function formatNumber(value: number | null | undefined): string {
  return numberFormatter.format(value ?? 0)
}

/** "https://example.com/a" -> "example.com/a", for compact display. */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '')
}

/** A date input gives "2026-12-31"; the backend wants a date-time, so use the end of that day. */
export function toBackendDateTime(dateInput: string): string {
  return `${dateInput}T23:59:59`
}

/** "2026-12-31T23:59:59" -> "2026-12-31", for a date input. */
export function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : ''
}

/** Today's date as "YYYY-MM-DD" in local time, used as the earliest allowed expiry. */
export function todayDateInputValue(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export type LinkStatus = 'active' | 'expired' | 'inactive'

export function getLinkStatus(link: Pick<ShortUrl, 'isActive' | 'expiresOn'>): LinkStatus {
  if (!link.isActive) return 'inactive'
  if (link.expiresOn && new Date(link.expiresOn).getTime() < Date.now()) return 'expired'
  return 'active'
}

/** Title to show for a link; the title is optional, so fall back to the destination's host. */
export function getLinkTitle(link: Pick<ShortUrl, 'title' | 'longUrl'>): string {
  if (link.title?.trim()) return link.title
  try {
    return new URL(link.longUrl).hostname
  } catch {
    return link.longUrl
  }
}

/** Only allow http(s) destinations, so a bad value can never run script in the page. */
export function isSafeHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}
