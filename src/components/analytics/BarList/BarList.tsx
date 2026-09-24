import { useMemo } from 'react'
import { formatNumber } from '../../../utils/format'
import './BarList.css'

interface BarListProps {
  /** Clicks per name, e.g. { Chrome: 742, Safari: 301 }. */
  data: Record<string, number>
  /** How many rows to show before folding the rest into "Other". */
  maxRows?: number
}

interface Row {
  name: string
  count: number
  share: number
  width: number
}

function toRows(data: Record<string, number>, maxRows: number): Row[] {
  const sorted = Object.entries(data)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)

  const visible = sorted.slice(0, maxRows)
  const rest = sorted.slice(maxRows).reduce((sum, [, count]) => sum + count, 0)
  if (rest > 0) visible.push(['Other', rest])

  const total = visible.reduce((sum, [, count]) => sum + count, 0)
  const max = Math.max(...visible.map(([, count]) => count), 1)

  return visible.map(([name, count]) => ({
    name,
    count,
    share: total ? Math.round((count / total) * 100) : 0,
    width: (count / max) * 100,
  }))
}

/** Horizontal bars, largest first. The numbers are always written out, so the bars are only a visual aid. */
export function BarList({ data, maxRows = 6 }: BarListProps) {
  const rows = useMemo(() => toRows(data, maxRows), [data, maxRows])

  return (
    <ul className="bar-list" role="list">
      {rows.map((row) => (
        <li key={row.name} className="bar-list__row">
          <div className="bar-list__labels">
            <span className="bar-list__name">{row.name}</span>
            <span className="bar-list__value">
              {formatNumber(row.count)} · {row.share}%
            </span>
          </div>
          <div className="bar-list__track" aria-hidden="true">
            <div className="bar-list__bar" style={{ width: `${row.width}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
