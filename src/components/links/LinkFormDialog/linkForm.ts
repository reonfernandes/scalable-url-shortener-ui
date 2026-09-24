import type { CreateUrlRequest, ShortUrl, UpdateUrlRequest } from '../../../api/types'
import { isSafeHttpUrl, todayDateInputValue, toBackendDateTime, toDateInputValue } from '../../../utils/format'

export interface LinkFormValues {
  longUrl: string
  title: string
  customAlias: string
  expiryDate: string
  password: string
}

export type LinkFormField = keyof LinkFormValues
export type LinkFormErrors = Partial<Record<LinkFormField, string>>

// Same limits as the backend's UrlRequest validation.
const ALIAS_PATTERN = /^[a-zA-Z0-9-]{7,30}$/

export function initialValues(link?: ShortUrl): LinkFormValues {
  return {
    longUrl: link?.longUrl ?? '',
    title: link?.title ?? '',
    customAlias: link?.shortCode ?? '',
    expiryDate: toDateInputValue(link?.expiresOn),
    password: '',
  }
}

export function validateLinkForm(values: LinkFormValues, isEdit: boolean): LinkFormErrors {
  const errors: LinkFormErrors = {}
  const longUrl = values.longUrl.trim()

  if (!longUrl) {
    if (!isEdit) errors.longUrl = 'Enter the URL you want to shorten.'
  } else if (!isSafeHttpUrl(longUrl)) {
    errors.longUrl = 'Enter a full URL starting with http:// or https://.'
  } else if (longUrl.length > 2048) {
    errors.longUrl = 'The URL can be at most 2048 characters.'
  }

  if (values.title.trim().length > 50) errors.title = 'The title can be at most 50 characters.'

  const alias = values.customAlias.trim()
  if (alias && !ALIAS_PATTERN.test(alias)) {
    errors.customAlias = 'Use 7–30 letters, numbers or hyphens.'
  }

  if (values.expiryDate && values.expiryDate < todayDateInputValue()) {
    errors.expiryDate = 'Pick today or a later date.'
  }

  if (values.password && (values.password.length < 4 || values.password.length > 72)) {
    errors.password = 'The password must be 4–72 characters.'
  }

  return errors
}

export function toCreateRequest(values: LinkFormValues): CreateUrlRequest {
  const request: CreateUrlRequest = { longUrl: values.longUrl.trim() }
  if (values.title.trim()) request.title = values.title.trim()
  if (values.customAlias.trim()) request.customAlias = values.customAlias.trim()
  if (values.expiryDate) request.expiresAt = toBackendDateTime(values.expiryDate)
  if (values.password) request.password = values.password
  return request
}

/** Sends only what changed; the backend leaves the other fields as they are. */
export function toUpdateRequest(values: LinkFormValues, link: ShortUrl): UpdateUrlRequest {
  const original = initialValues(link)
  const request: UpdateUrlRequest = {}
  if (values.longUrl.trim() && values.longUrl.trim() !== original.longUrl) request.longUrl = values.longUrl.trim()
  if (values.title.trim() && values.title.trim() !== original.title) request.title = values.title.trim()
  if (values.customAlias.trim() && values.customAlias.trim() !== original.customAlias) {
    request.customAlias = values.customAlias.trim()
  }
  if (values.expiryDate && values.expiryDate !== original.expiryDate) {
    request.expiresAt = toBackendDateTime(values.expiryDate)
  }
  if (values.password) request.password = values.password
  return request
}

/** Backend field names differ from ours in one place. */
export function mapServerFieldErrors(fieldErrors: Record<string, string>): LinkFormErrors {
  const errors: LinkFormErrors = {}
  for (const [field, message] of Object.entries(fieldErrors)) {
    const key = (field === 'expiresAt' ? 'expiryDate' : field) as LinkFormField
    if (key in initialValues()) errors[key] = message
  }
  return errors
}
