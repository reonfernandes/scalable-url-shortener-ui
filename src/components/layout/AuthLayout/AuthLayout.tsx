import { Suspense } from 'react'
import { ArrowDown } from 'lucide-react'
import { Outlet } from 'react-router'
import { Logo } from '../../common/Logo/Logo'
import { Spinner } from '../../ui/Spinner/Spinner'
import './AuthLayout.css'

/** Split screen for the login and sign-up pages: brand panel on the left, form on the right. */
export function AuthLayout() {
  return (
    <div className="auth-layout">
      <aside className="auth-layout__brand">
        <Logo tone="light" />
        <div className="auth-layout__pitch">
          <p className="auth-layout__headline">Short links you can track.</p>
          <p className="auth-layout__lead">
            Turn long URLs into clean links, protect them with a password or an expiry date, and see who clicks.
          </p>
          <figure className="auth-layout__example" aria-label="Example of a shortened link">
            <span className="auth-layout__long-url">
              https://shop.example.com/campaigns/spring-2026?utm_source=newsletter&amp;utm_medium=email
            </span>
            <ArrowDown size={20} className="auth-layout__arrow" aria-hidden="true" />
            <span className="auth-layout__short-url">microurl.ly/spring-sale-24</span>
          </figure>
        </div>
      </aside>
      <main className="auth-layout__main">
        <div className="auth-layout__mobile-logo">
          <Logo />
        </div>
        <div className="auth-layout__content">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
