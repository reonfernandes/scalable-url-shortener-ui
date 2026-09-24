import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../ui/Spinner/Spinner'

/** Only lets logged-in users through; everyone else goes to the login page. */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <Spinner fullPage label="Checking your session" />
  if (status === 'anonymous') {
    // Remember where they wanted to go, so login can send them back there.
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return <Outlet />
}
