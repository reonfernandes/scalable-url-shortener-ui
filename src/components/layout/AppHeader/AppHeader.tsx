import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getInitials } from '../../../utils/format'
import { isAdmin } from '../../../utils/roles'
import { Logo } from '../../common/Logo/Logo'
import { Button } from '../../ui/Button/Button'
import './AppHeader.css'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'app-header__nav-link app-header__nav-link--active' : 'app-header__nav-link'

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
        <div className="app-header__start">
          <Logo to="/dashboard" />
          {/* Only admins get a second page, so only they need the menu. */}
          {isAdmin(user) && (
            <nav className="app-header__nav" aria-label="Main">
              <NavLink to="/dashboard" className={navLinkClass}>
                Your links
              </NavLink>
              <NavLink to="/admin/users" className={navLinkClass}>
                Users
                <span className="app-header__admin-badge">Admin</span>
              </NavLink>
            </nav>
          )}
        </div>
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
