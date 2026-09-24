import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthForm } from '../../components/auth/AuthForm/AuthForm'
import { PasswordRules } from '../../components/auth/PasswordRules/PasswordRules'
import { isStrongPassword } from '../../components/auth/PasswordRules/passwordRules'
import { Seo } from '../../components/common/Seo/Seo'
import { Alert } from '../../components/ui/Alert/Alert'
import { Button } from '../../components/ui/Button/Button'
import { TextField } from '../../components/ui/TextField/TextField'
import { useAuth } from '../../hooks/useAuth'
import { parseApiError } from '../../utils/errors'
import { isValidEmail } from '../../utils/validation'

type Field = 'name' | 'email' | 'password'
type Errors = Partial<Record<Field, string>>

// Mirrors the backend's RegistrationRequest validation.
function validate(name: string, email: string, password: string): Errors {
  const errors: Errors = {}
  const trimmedName = name.trim()
  if (!trimmedName) errors.name = 'Enter your name.'
  else if (trimmedName.length < 2 || trimmedName.length > 100) errors.name = 'Name must be 2 to 100 characters.'
  if (!email.trim()) errors.email = 'Enter your email.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!isStrongPassword(password)) errors.password = 'Your password needs everything in the list below.'
  return errors
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validate(name, email, password)
    setErrors(validationErrors)
    setFormError('')
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await register({ name: name.trim(), email: email.trim(), password })
      navigate('/login', { replace: true, state: { registered: true, email: email.trim() } })
    } catch (error) {
      const parsed = parseApiError(error)
      if (parsed.status === 409) {
        setErrors({ email: 'An account with this email already exists.' })
      } else {
        setErrors(parsed.fieldErrors)
        setFormError(parsed.message)
      }
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title="Create an account"
        description="Sign up for microurl for free and start shortening, protecting and tracking your links."
      />
      <AuthForm
        title="Create your account"
        subtitle="Start shortening links in under a minute."
        onSubmit={handleSubmit}
        message={formError ? <Alert>{formError}</Alert> : null}
        actions={
          <Button type="submit" fullWidth loading={submitting}>
            Create account
          </Button>
        }
        footer={
          <>
            Already have an account? <Link to="/login">Log in</Link>
          </>
        }
      >
        <TextField
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="John Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          maxLength={100}
          required
        />
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint={<PasswordRules password={password} />}
          maxLength={72}
          revealable
          required
        />
      </AuthForm>
    </>
  )
}
