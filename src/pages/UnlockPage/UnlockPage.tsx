import { useState, type FormEvent } from 'react'
import { Lock } from 'lucide-react'
import { useParams } from 'react-router'
import { unlockUrl } from '../../api/urlService'
import { Logo } from '../../components/common/Logo/Logo'
import { Seo } from '../../components/common/Seo/Seo'
import { Alert } from '../../components/ui/Alert/Alert'
import { Button } from '../../components/ui/Button/Button'
import { TextField } from '../../components/ui/TextField/TextField'
import { parseApiError } from '../../utils/errors'
import { isSafeHttpUrl } from '../../utils/format'
import './UnlockPage.css'

/** Public page where a visitor enters the password of a protected short link. */
export default function UnlockPage() {
  const { shortCode = '' } = useParams()
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')
    if (!password) {
      setPasswordError('Enter the password.')
      return
    }
    setPasswordError('')
    setSubmitting(true)

    try {
      const { longUrl } = await unlockUrl(shortCode, password)
      if (!isSafeHttpUrl(longUrl)) throw new Error('Unsafe destination')
      // replace(): the back button shouldn't return to the password page.
      window.location.replace(longUrl)
    } catch (error) {
      const parsed = parseApiError(error, 'This link could not be opened.')
      if (/incorrect password/i.test(parsed.message)) setPasswordError('That password is not correct.')
      else if (parsed.status === 404) setFormError("This link doesn't exist.")
      else setFormError(parsed.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="unlock">
      <Seo title="Password-protected link" noIndex />
      <main className="unlock__card">
        <span className="unlock__icon" aria-hidden="true">
          <Lock size={22} />
        </span>
        <div className="unlock__heading">
          <h1 className="unlock__title">This link is password protected</h1>
          <p className="unlock__text">Enter the password you were given to continue.</p>
        </div>
        {formError && <Alert>{formError}</Alert>}
        <form className="unlock__form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Password"
            type="password"
            autoComplete="off"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={passwordError}
            revealable
            autoFocus
          />
          <Button type="submit" fullWidth loading={submitting}>
            Continue
          </Button>
        </form>
      </main>
      <p className="unlock__footer">
        Shortened with <Logo size="sm" to="/" />
      </p>
    </div>
  )
}
