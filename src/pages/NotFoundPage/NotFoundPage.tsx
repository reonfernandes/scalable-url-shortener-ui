import { Link2Off } from 'lucide-react'
import { Seo } from '../../components/common/Seo/Seo'
import { ButtonLink } from '../../components/ui/Button/ButtonLink'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <Seo title="Page not found" noIndex />
      <span className="not-found__icon" aria-hidden="true">
        <Link2Off size={24} />
      </span>
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__text">The page you're looking for doesn't exist or has moved.</p>
      <ButtonLink to="/" variant="dark">
        Go to home
      </ButtonLink>
    </main>
  )
}
