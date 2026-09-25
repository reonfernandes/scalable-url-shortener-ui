import { Lock } from 'lucide-react'
import { Outlet } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { isAdmin } from '../../utils/roles'
import { Seo } from '../common/Seo/Seo'
import { ButtonLink } from '../ui/Button/ButtonLink'
import { EmptyState } from '../ui/EmptyState/EmptyState'

/**
 * Admin pages. Put it inside RequireAuth, so the user is already known.
 * This only hides the page: the gateway rejects admin API calls from non-admins anyway.
 */
export function RequireAdmin() {
  const { user } = useAuth()

  if (!isAdmin(user)) {
    return (
      <>
        <Seo title="Admins only" noIndex />
        <EmptyState
          icon={<Lock size={22} aria-hidden="true" />}
          title="Admins only"
          action={
            <ButtonLink to="/dashboard" variant="dark">
              Back to your links
            </ButtonLink>
          }
        >
          This page is for administrators. Your account doesn't have access to it.
        </EmptyState>
      </>
    )
  }
  return <Outlet />
}
