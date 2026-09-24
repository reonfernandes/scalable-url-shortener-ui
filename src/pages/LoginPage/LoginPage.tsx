import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthForm } from '../../components/auth/AuthForm/AuthForm'
import { Seo } from '../../components/common/Seo/Seo'
import { Alert } from '../../components/ui/Alert/Alert'
import { Button } from '../../components/ui/Button/Button'
import { TextField } from '../../components/ui/TextField/TextField'
import { useAuth } from '../../hooks/useAuth'
import { parseApiError } from '../../utils/errors'
import { isValidEmail, safeRedirectPath } from '../../utils/validation'

interface LoginLocationState {
  from?: string
  registered?: boolean
  email?: string
}

type Errors = Partial<Record<'email' | 'password', string>>

function validate(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!email.trim()) errors.email = 'Enter your email.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Enter your password.'
  return errors
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const state = (useLocation().state ?? {}) as LoginLocationState

  const [email, setEmail] = useState(state.email ?? '')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validate(email, password)
    setErrors(validationErrors)
    setFormError('')
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      navigate(safeRedirectPath(state.from), { replace: true })
    } catch (error) {
      const parsed = parseApiError(error)
      if (parsed.status === 401) {
        setFormError(
          /disabled/i.test(parsed.message)
            ? 'This account has been deactivated. Contact support if you think this is a mistake.'
            : 'Email or password is incorrect.',
        )
      } else {
        setErrors(parsed.fieldErrors)
        setFormError(parsed.message)
      }
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo title="Log in" description="Log in to microurl to create short links and see their click stats." />
      <AuthForm
        title="Log in"
        subtitle="Welcome back. Enter your email and password."
        onSubmit={handleSubmit}
        message={
          formError ? (
            <Alert>{formError}</Alert>
          ) : state.registered ? (
            <Alert tone="success">Your account is ready. Log in to continue.</Alert>
          ) : null
        }
        actions={
          <Button type="submit" fullWidth loading={submitting}>
            Log in
          </Button>
        }
        footer={
          <>
            New to microurl? <Link to="/register">Create an account</Link>
          </>
        }
      >
        <TextField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          revealable
          required
        />
      </AuthForm>
    </>
  )
}
