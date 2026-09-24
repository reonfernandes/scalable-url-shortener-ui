import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authService from '../api/authService'
import { setUnauthorizedHandler } from '../api/client'
import type { LoginRequest, RegisterRequest, User } from '../api/types'
import { isCancelled } from '../utils/errors'
import { AuthContext, type AuthContextValue, type AuthStatus } from './authContext'

/**
 * Keeps track of who is logged in.
 *
 * The JWT is in an HttpOnly cookie that JavaScript can't read, so on start-up
 * we ask the backend (GET /me) whether the cookie is still valid.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const signOutLocally = useCallback(() => {
    setUser(null)
    setStatus('anonymous')
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    authService
      .getCurrentUser(controller.signal)
      .then((currentUser) => {
        setUser(currentUser)
        setStatus('authenticated')
      })
      .catch((error: unknown) => {
        if (!isCancelled(error)) signOutLocally()
      })

    // Any request that comes back 401 later means the session has expired.
    setUnauthorizedHandler(signOutLocally)

    return () => {
      controller.abort()
      setUnauthorizedHandler(null)
    }
  }, [signOutLocally])

  const login = useCallback(async (request: LoginRequest) => {
    await authService.login(request)
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    setStatus('authenticated')
  }, [])

  const register = useCallback(async (request: RegisterRequest) => {
    await authService.register(request)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      // Even if the request fails, forget the user on this device.
      signOutLocally()
    }
  }, [signOutLocally])

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
