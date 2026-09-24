const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

/** Only follow "go back to" paths inside this app, never to another site. */
export function safeRedirectPath(path: unknown, fallback = '/dashboard'): string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? path : fallback
}
