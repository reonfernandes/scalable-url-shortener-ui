import { useId, type ReactNode } from 'react'
import './Card.css'

interface CardProps {
  title: string
  /** Shows the title small and grey, for number cards. */
  quietTitle?: boolean
  className?: string
  children: ReactNode
}

export function Card({ title, quietTitle = false, className, children }: CardProps) {
  const titleId = useId()
  return (
    <section className={['card', className].filter(Boolean).join(' ')} aria-labelledby={titleId}>
      <h2 id={titleId} className={quietTitle ? 'card__title card__title--quiet' : 'card__title'}>
        {title}
      </h2>
      {children}
    </section>
  )
}
