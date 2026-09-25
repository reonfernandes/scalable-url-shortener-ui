import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { createUrl, updateUrl } from '../../../api/urlService'
import type { ShortUrl, UpdateUrlRequest } from '../../../api/types'
import { parseApiError } from '../../../utils/errors'
import { stripProtocol, todayDateInputValue } from '../../../utils/format'
import { Alert } from '../../ui/Alert/Alert'
import { Button } from '../../ui/Button/Button'
import { Dialog } from '../../ui/Dialog/Dialog'
import { TextField } from '../../ui/TextField/TextField'
import {
  initialValues,
  mapServerFieldErrors,
  toCreateRequest,
  toUpdateRequest,
  validateLinkForm,
  type LinkFormCheckbox,
  type LinkFormErrors,
  type LinkFormTextField,
  type LinkFormValues,
} from './linkForm'
import './LinkFormDialog.css'

const SHORT_URL_BASE = import.meta.env.VITE_SHORT_URL_BASE || 'http://localhost:8080'

type LinkFormDialogProps = {
  onClose: () => void
} & (
  | { mode: 'create'; onCreated: (link: ShortUrl) => void }
  | { mode: 'edit'; link: ShortUrl; onSaved: (changes: UpdateUrlRequest) => void }
)

/** Creates a new short link, or edits an existing one. Mount it only while it should be open. */
export function LinkFormDialog(props: LinkFormDialogProps) {
  const isEdit = props.mode === 'edit'
  const link = isEdit ? props.link : undefined
  const formId = useId()

  const [values, setValues] = useState<LinkFormValues>(() => initialValues(link))
  const [errors, setErrors] = useState<LinkFormErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // "localhost:8080/" in front of the alias field: from the link itself when editing, else from config.
  const shortUrlBase = link ? link.shortUrl.slice(0, -link.shortCode.length) : `${SHORT_URL_BASE}/`
  const shortUrlPrefix = stripProtocol(shortUrlBase)

  const setField = (field: LinkFormTextField) => (event: ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [field]: event.target.value }))
  const setCheckbox = (field: LinkFormCheckbox) => (event: ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [field]: event.target.checked }))

  // Only an existing expiry date or password can be removed.
  const canRemoveExpiry = Boolean(isEdit && link?.expiresOn)
  const canRemovePassword = Boolean(isEdit && link?.isPasswordProtected)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validateLinkForm(values, link)
    setErrors(validationErrors)
    setFormError('')
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      if (props.mode === 'create') {
        const created = await createUrl(toCreateRequest(values))
        props.onCreated(created)
      } else {
        const request = toUpdateRequest(values, props.link)
        if (Object.keys(request).length > 0) await updateUrl(props.link.urlId, request)
        props.onSaved(request)
      }
    } catch (error) {
      const parsed = parseApiError(error)
      if (parsed.status === 409) {
        setErrors({ customAlias: 'This alias is already taken. Try another one.' })
      } else {
        setErrors(mapServerFieldErrors(parsed.fieldErrors))
        setFormError(parsed.message)
      }
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open
      onClose={props.onClose}
      title={isEdit ? 'Edit link' : 'Create a short link'}
      description={isEdit ? 'Only the fields you change are updated.' : 'Only the destination is required.'}
      footer={
        <>
          <Button variant="secondary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={submitting}>
            {isEdit ? 'Save changes' : 'Create link'}
          </Button>
        </>
      }
    >
      <form id={formId} className="link-form" onSubmit={handleSubmit} noValidate>
        {formError && <Alert>{formError}</Alert>}

        <TextField
          label="Destination URL"
          type="url"
          inputMode="url"
          placeholder="https://example.com/a/very/long/page"
          value={values.longUrl}
          onChange={setField('longUrl')}
          error={errors.longUrl}
          maxLength={2048}
          required={!isEdit}
          autoFocus
        />

        <div className="link-form__divider" role="presentation">
          <span>Optional</span>
        </div>

        <TextField
          label="Title"
          placeholder="Spring sale landing page"
          value={values.title}
          onChange={setField('title')}
          error={errors.title}
          maxLength={50}
        />

        <TextField
          label="Custom alias"
          prefix={shortUrlPrefix}
          mono
          placeholder="spring-sale-24"
          value={values.customAlias}
          onChange={setField('customAlias')}
          error={errors.customAlias}
          hint={
            isEdit
              ? '7–30 letters, numbers or hyphens. Changing it breaks the old short link.'
              : '7–30 letters, numbers or hyphens. Leave it empty to get a random code.'
          }
          maxLength={30}
          autoCapitalize="off"
          spellCheck={false}
        />

        <div className="link-form__row">
          <div className="link-form__field">
            <TextField
              label="Expires on"
              type="date"
              min={todayDateInputValue()}
              value={values.expiryDate}
              onChange={setField('expiryDate')}
              error={errors.expiryDate}
              disabled={values.removeExpiry}
            />
            {canRemoveExpiry && (
              <label className="link-form__check">
                <input type="checkbox" checked={values.removeExpiry} onChange={setCheckbox('removeExpiry')} />
                Remove expiry date
              </label>
            )}
          </div>
          <div className="link-form__field">
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder={canRemovePassword ? 'Keep current password' : 'No password'}
              value={values.password}
              onChange={setField('password')}
              error={errors.password}
              maxLength={72}
              revealable
              disabled={values.removePassword}
            />
            {canRemovePassword && (
              <label className="link-form__check">
                <input type="checkbox" checked={values.removePassword} onChange={setCheckbox('removePassword')} />
                Remove password
              </label>
            )}
          </div>
        </div>
        <p className="link-form__note">
          With a password, visitors must enter it before they are sent to the destination.
        </p>
      </form>
    </Dialog>
  )
}
