import type { User } from '../api/types'

/** Admins see the Users page. The backend checks the role again on every admin request. */
export function isAdmin(user: User | null | undefined): boolean {
  return user?.roles?.includes('ADMIN') ?? false
}
