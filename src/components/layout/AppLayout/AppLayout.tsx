import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { Spinner } from '../../ui/Spinner/Spinner'
import { AppHeader } from '../AppHeader/AppHeader'
import './AppLayout.css'

/** Frame for pages behind the login: header on top, page below. */
export function AppLayout() {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <AppHeader />
      <main id="main-content" className="app-layout__main" tabIndex={-1}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
