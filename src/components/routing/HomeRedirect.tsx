import { Navigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../ui/Spinner/Spinner'

/** "/" sends people to the dashboard or the login page. */
export function HomeRedirect() {
  const { status } = useAuth()

  if (status === 'loading') return <Spinner fullPage label="Checking your session" />
  return <Navigate to={status === 'authenticated' ? '/dashboard' : '/login'} replace />
}
