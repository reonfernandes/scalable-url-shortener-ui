import { useCallback, useEffect, useState } from 'react'
import { RotateCw, Users } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { activateUser, getUsers } from '../../api/adminService'
import type { User, UserStatusFilter as Status } from '../../api/types'
import { DeactivateUserDialog } from '../../components/admin/DeactivateUserDialog/DeactivateUserDialog'
import { UserList } from '../../components/admin/UserList/UserList'
import { UserStatusFilter } from '../../components/admin/UserStatusFilter/UserStatusFilter'
import { Seo } from '../../components/common/Seo/Seo'
import { Pagination } from '../../components/links/Pagination/Pagination'
import { Alert } from '../../components/ui/Alert/Alert'
import { Button } from '../../components/ui/Button/Button'
import { EmptyState } from '../../components/ui/EmptyState/EmptyState'
import { SearchField } from '../../components/ui/SearchField/SearchField'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useApiQuery } from '../../hooks/useApiQuery'
import { useAuth } from '../../hooks/useAuth'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { parseApiError } from '../../utils/errors'
import './AdminUsersPage.css'

const PAGE_SIZE = 10
const STATUSES: Status[] = ['all', 'active', 'deactivated']

function readStatus(value: string | null): Status {
  return STATUSES.includes(value as Status) ? (value as Status) : 'all'
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  // Page, filter and search live in the URL (?page=2&status=active&q=alice), so refresh keeps them.
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const status = readStatus(searchParams.get('status'))
  const search = searchParams.get('q') ?? ''

  const [searchInput, setSearchInput] = useState(search)
  // Search once the admin stops typing, not on every key press.
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300)

  const [deactivating, setDeactivating] = useState<User | null>(null)
  const [activatingId, setActivatingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  /** Changes some URL parameters; filters and searches start again on page 1. */
  const updateParams = useCallback(
    (changes: { page?: number; status?: Status; q?: string }) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          const set = (key: string, value: string | undefined) => (value ? next.set(key, value) : next.delete(key))
          if (changes.status !== undefined) set('status', changes.status === 'all' ? undefined : changes.status)
          if (changes.q !== undefined) set('q', changes.q)
          set('page', changes.page && changes.page > 1 ? String(changes.page) : undefined)
          return next
        },
        // Typing a search shouldn't fill the back button's history.
        { replace: changes.q !== undefined },
      )
    },
    [setSearchParams],
  )

  useEffect(() => {
    if (debouncedSearch !== search) updateParams({ q: debouncedSearch })
  }, [debouncedSearch, search, updateParams])

  const { data, error, loading, reload } = useApiQuery(
    (signal) => getUsers({ page, size: PAGE_SIZE, search, status }, signal),
    `users:${page}:${status}:${search}`,
  )

  const goToPage = useCallback(
    (nextPage: number) => {
      updateParams({ page: nextPage })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [updateParams],
  )

  // Stable callbacks so list rows don't re-render when other state changes.
  const openDeactivate = useCallback((user: User) => {
    setNotice(null)
    setDeactivating(user)
  }, [])

  const handleActivate = useCallback(
    async (user: User) => {
      setNotice(null)
      setActivatingId(user.userId)
      try {
        await activateUser(user.userId)
        setNotice({ tone: 'success', text: `${user.name} is active again. Their links work again.` })
        reload()
      } catch (err) {
        setNotice({ tone: 'error', text: parseApiError(err, `${user.name} could not be activated.`).message })
      } finally {
        setActivatingId(null)
      }
    },
    [reload],
  )

  const handleDeactivated = (user: User) => {
    setDeactivating(null)
    setNotice({ tone: 'success', text: `${user.name} was deactivated and logged out.` })
    reload()
  }

  const total = data?.totalElements ?? 0
  const filtered = search !== '' || status !== 'all'

  return (
    <div className="admin-users">
      <Seo title="Users" noIndex />

      <div className="admin-users__header">
        <div className="admin-users__heading">
          <h1 className="admin-users__title">Users</h1>
          <p className="admin-users__intro">
            Everyone with a microurl account. Deactivating a user logs them out and turns off all their links.
          </p>
        </div>
        <p className="admin-users__count" aria-live="polite">
          {data ? `${total} ${total === 1 ? 'user' : 'users'}` : ' '}
        </p>
      </div>

      <div className="admin-users__toolbar">
        <SearchField
          label="Search users"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="admin-users__search"
          maxLength={100}
        />
        <UserStatusFilter value={status} onChange={(value) => updateParams({ status: value })} />
      </div>

      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      {error && (
        <Alert>
          {error.message}{' '}
          <Button variant="ghost" size="sm" onClick={reload} icon={<RotateCw size={14} aria-hidden="true" />}>
            Try again
          </Button>
        </Alert>
      )}

      {!data && loading && <Spinner label="Loading users" />}

      {data && total === 0 && (
        <div className="admin-users__empty">
          <EmptyState icon={<Users size={22} aria-hidden="true" />} title={filtered ? 'No users match' : 'No users yet'}>
            {filtered ? 'Try another name or email, or a different filter.' : 'People appear here once they sign up.'}
          </EmptyState>
        </div>
      )}

      {data && total > 0 && (
        <div className={loading ? 'admin-users__list admin-users__list--loading' : 'admin-users__list'} aria-busy={loading}>
          <UserList
            users={data.content}
            currentUserId={currentUser?.userId}
            activatingId={activatingId}
            onDeactivate={openDeactivate}
            onActivate={handleActivate}
            footer={
              <Pagination
                page={data.page}
                size={data.size}
                totalElements={data.totalElements}
                totalPages={data.totalPages}
                onPageChange={goToPage}
              />
            }
          />
        </div>
      )}

      {deactivating && (
        <DeactivateUserDialog
          user={deactivating}
          onClose={() => setDeactivating(null)}
          onDeactivated={handleDeactivated}
        />
      )}
    </div>
  )
}
