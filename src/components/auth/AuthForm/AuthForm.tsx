import type { FormEventHandler, ReactNode } from 'react'
import './AuthForm.css'

interface AuthFormProps {
  title: string
  subtitle: string
  onSubmit: FormEventHandler<HTMLFormElement>
  /** Shown above the fields, e.g. an error or success message. */
  message?: ReactNode
  /** The submit button. */
  actions: ReactNode
  /** Link to the other auth page. */
  footer: ReactNode
  children: ReactNode
}

/** Shared frame for the login and sign-up forms. */
export function AuthForm({ title, subtitle, onSubmit, message, actions, footer, children }: AuthFormProps) {
  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <h1 className="auth-form__title">{title}</h1>
        <p className="auth-form__subtitle">{subtitle}</p>
      </div>
      {message}
      <form className="auth-form__form" onSubmit={onSubmit} noValidate>
        <div className="auth-form__fields">{children}</div>
        {actions}
      </form>
      <p className="auth-form__footer">{footer}</p>
    </div>
  )
}
