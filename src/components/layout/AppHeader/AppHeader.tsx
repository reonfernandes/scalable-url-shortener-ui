import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'
import { Logo } from '../../common/Logo/Logo'
import { Button } from '../../ui/Button/Button'
import './AppHeader.css'

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Logo to="/dashboard" />
        <div className="app-header__account">
          {user && (
            <div className="app-header__user">
              <span className="app-header__avatar" aria-hidden="true">
                {getInitials(user.name)}
              </span>
              <span className="app-header__user-text">
                <span className="app-header__name">{user.name}</span>
                <span className="app-header__email">{user.email}</span>
              </span>
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            loading={loggingOut}
            icon={<LogOut size={16} aria-hidden="true" />}
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
