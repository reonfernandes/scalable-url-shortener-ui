import axios from 'axios'

/**
 * One Axios instance for the whole app.
 *
 * The login token lives in an HttpOnly cookie that JavaScript cannot read,
 * so `withCredentials` makes the browser send it with every request.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

/** Called by the auth provider so an expired session logs the user out everywhere. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler
}

// Paths where a 401 is an expected answer, not an expired session.
const AUTH_PATHS = ['/api/v1/user/login', '/api/v1/user/me']

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? ''
      if (!AUTH_PATHS.some((path) => url.startsWith(path))) {
        unauthorizedHandler?.()
      }
    }
    return Promise.reject(error)
  },
)
