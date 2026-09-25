// Shapes of the JSON the backend sends and receives (through the API gateway).

/** Wrapper used by user-service and url-service for successful responses. */
export interface ApiResponse<T> {
  status: number
  message: string
  data?: T
}

/** Body of every error response from the backend. */
export interface ApiErrorBody {
  status: number
  error: string
  message: string
  timeStamp?: string
  fieldErrors?: Record<string, string> | null
}

export interface PageResponse<T> {
  content: T[]
  /** Starts at 1. */
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// ---- Users ----

export interface User {
  userId: string
  name: string
  email: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  userId: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  /** Seconds until the login cookie expires. */
  expiresIn: number
}

// ---- Short URLs ----

export interface ShortUrl {
  urlId: number
  userId: string
  title: string | null
  shortCode: string
  shortUrl: string
  longUrl: string
  isActive: boolean
  isPasswordProtected: boolean
  /** ISO date-time without a time zone, e.g. "2026-09-24T10:15:30". */
  createdAt: string | null
  expiresOn: string | null
}

export interface CreateUrlRequest {
  longUrl: string
  title?: string
  customAlias?: string
  /** ISO date-time without a time zone, e.g. "2026-12-31T23:59:59". */
  expiresAt?: string
  password?: string
}

/** Only the fields that are sent are changed. */
export interface UpdateUrlRequest extends Partial<CreateUrlRequest> {
  /** true: the link never expires. */
  removeExpiry?: boolean
  /** true: the link no longer needs a password. */
  removePassword?: boolean
}

export interface UnlockUrlResponse {
  longUrl: string
}

// ---- Analytics ----

export interface UrlStats {
  urlId: number
  totalClicks: number
  clicksByBrowser: Record<string, number>
  clicksByOs: Record<string, number>
  clicksByCountry: Record<string, number>
}

/** Total clicks per link, keyed by urlId, e.g. { "1": 12, "2": 0 }. */
export type ClickCounts = Record<string, number>
