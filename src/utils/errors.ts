import axios from 'axios'
import type { ApiErrorBody } from '../api/types'

export interface ParsedError {
  message: string
  /** Validation messages per field name, e.g. { email: "Must be a valid email address" }. */
  fieldErrors: Record<string, string>
  status?: number
}

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.'
const TOO_MANY_ATTEMPTS_MESSAGE = 'Too many attempts. Please wait a moment and try again.'

/** Turns any thrown error into a message that is safe to show the user. */
export function parseApiError(error: unknown, fallback = DEFAULT_MESSAGE): ParsedError {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return { message: fallback, fieldErrors: {} }
  }

  if (!error.response) {
    return {
      message: "Can't reach the server. Check your connection and try again.",
      fieldErrors: {},
    }
  }

  const { status, data } = error.response

  // The API gateway limits password attempts (login, sign-up, unlocking a link) and answers 429 with no body.
  if (status === 429) {
    return { message: TOO_MANY_ATTEMPTS_MESSAGE, fieldErrors: {}, status }
  }

  // Server errors carry no useful detail for the user.
  const message = status >= 500 ? fallback : data?.message || fallback

  return {
    message,
    fieldErrors: data?.fieldErrors ?? {},
    status,
  }
}

/** True when a request was cancelled on purpose (for example when a page closes). */
export function isCancelled(error: unknown): boolean {
  return axios.isCancel(error)
}
