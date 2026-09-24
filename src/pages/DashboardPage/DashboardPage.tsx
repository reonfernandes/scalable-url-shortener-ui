import { useCallback, useState } from 'react'
import { Link2, Plus, RotateCw } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { getMyUrls } from '../../api/urlService'
import type { ShortUrl } from '../../api/types'
import { Seo } from '../../components/common/Seo/Seo'
import { DeleteLinkDialog } from '../../components/links/DeleteLinkDialog/DeleteLinkDialog'
import { LinkCreatedDialog } from '../../components/links/LinkCreatedDialog/LinkCreatedDialog'
import { LinkFormDialog } from '../../components/links/LinkFormDialog/LinkFormDialog'
import { LinkList } from '../../components/links/LinkList/LinkList'
import { Pagination } from '../../components/links/Pagination/Pagination'
import { Alert } from '../../components/ui/Alert/Alert'
import { Button } from '../../components/ui/Button/Button'
import { EmptyState } from '../../components/ui/EmptyState/EmptyState'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useApiQuery } from '../../hooks/useApiQuery'
import './DashboardPage.css'

const PAGE_SIZE = 10

type DialogState =
  | { type: 'create' }
  | { type: 'created'; link: ShortUrl }
  | { type: 'edit'; link: ShortUrl }
  | { type: 'delete'; link: ShortUrl }
  | null

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  // The page lives in the URL (?page=2), so refresh and the back button keep it.
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const [dialog, setDialog] = useState<DialogState>(null)

  const { data, error, loading, reload } = useApiQuery(
    (signal) => getMyUrls(page, PAGE_SIZE, signal),
    `my-urls:${page}`,
  )

  const goToPage = useCallback(
    (nextPage: number) => {
      setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setSearchParams],
  )

  // Stable callbacks so list rows don't re-render when the dialog state changes.
  const openEdit = useCallback((link: ShortUrl) => setDialog({ type: 'edit', link }), [])
  const openDelete = useCallback((link: ShortUrl) => setDialog({ type: 'delete', link }), [])
  const closeDialog = useCallback(() => setDialog(null), [])

  const handleDeleted = () => {
    setDialog(null)
    // Deleting the last link on a page: step back so we don't show an empty page.
    if (data && data.content.length === 1 && page > 1) goToPage(page - 1)
    else reload()
  }

  const total = data?.totalElements ?? 0

  return (
    <div className="dashboard">
      <Seo title="Your links" noIndex />

      <div className="dashboard__header">
        <div className="dashboard__heading">
          <h1 className="dashboard__title">Your links</h1>
          <p className="dashboard__count" aria-live="polite">
            {data ? `${total} ${total === 1 ? 'link' : 'links'}` : ' '}
          </p>
        </div>
        <Button onClick={() => setDialog({ type: 'create' })} icon={<Plus size={18} strokeWidth={2.25} aria-hidden="true" />}>
          New link
        </Button>
      </div>

      {error && (
        <Alert>
          {error.message}{' '}
          <Button variant="ghost" size="sm" onClick={reload} icon={<RotateCw size={14} aria-hidden="true" />}>
            Try again
          </Button>
        </Alert>
      )}

      {!data && loading && <Spinner label="Loading your links" />}

      {data && total === 0 && (
        <div className="dashboard__empty">
          <EmptyState
            icon={<Link2 size={22} aria-hidden="true" />}
            title="No links yet"
            action={
              <Button onClick={() => setDialog({ type: 'create' })} icon={<Plus size={18} aria-hidden="true" />}>
                Create your first link
              </Button>
            }
          >
            Paste a long URL and get a short one you can share and track.
          </EmptyState>
        </div>
      )}

      {data && total > 0 && (
        <div className={loading ? 'dashboard__list dashboard__list--loading' : 'dashboard__list'} aria-busy={loading}>
          <LinkList
            links={data.content}
            onEdit={openEdit}
            onDelete={openDelete}
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

      {dialog?.type === 'create' && (
        <LinkFormDialog
          mode="create"
          onClose={closeDialog}
          onCreated={(link) => {
            setDialog({ type: 'created', link })
            reload()
          }}
        />
      )}
      {dialog?.type === 'created' && (
        <LinkCreatedDialog
          link={dialog.link}
          onClose={closeDialog}
          onCreateAnother={() => setDialog({ type: 'create' })}
        />
      )}
      {dialog?.type === 'edit' && (
        <LinkFormDialog
          mode="edit"
          link={dialog.link}
          onClose={closeDialog}
          onSaved={() => {
            setDialog(null)
            reload()
          }}
        />
      )}
      {dialog?.type === 'delete' && (
        <DeleteLinkDialog link={dialog.link} onClose={closeDialog} onDeleted={handleDeleted} />
      )}
    </div>
  )
}
