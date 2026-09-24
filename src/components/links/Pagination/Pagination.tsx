import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../ui/Button/Button'
import './Pagination.css'

interface PaginationProps {
  /** Starts at 1. */
  page: number
  size: number
  totalElements: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, size, totalElements, totalPages, onPageChange }: PaginationProps) {
  const first = totalElements === 0 ? 0 : (page - 1) * size + 1
  const last = Math.min(page * size, totalElements)

  return (
    <nav className="pagination" aria-label="Pages">
      <span className="pagination__summary">
        Showing {first}–{last} of {totalElements}
      </span>
      <div className="pagination__buttons">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          icon={<ChevronLeft size={16} aria-hidden="true" />}
        >
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
