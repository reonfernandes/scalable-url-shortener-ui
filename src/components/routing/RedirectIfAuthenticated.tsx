import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../ui/Spinner/Spinner'

/** Login and sign-up pages: logged-in users go straight to the dashboard. */
export function RedirectIfAuthenticated() {
  const { status } = useAuth()

  if (status === 'loading') return <Spinner fullPage label="Checking your session" />
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
