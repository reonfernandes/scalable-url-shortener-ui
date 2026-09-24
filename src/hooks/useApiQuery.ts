import { useCallback, useEffect, useRef, useState } from 'react'
import { isCancelled, parseApiError, type ParsedError } from '../utils/errors'

interface QueryState<T> {
  requestKey: string
  data?: T
  error?: ParsedError
}

export interface ApiQuery<T> {
  /** The latest result. Kept while a new request loads, so the page doesn't flash empty. */
  data: T | undefined
  error: ParsedError | undefined
  loading: boolean
  reload: () => void
}

/**
 * Loads data when the component mounts and whenever `key` changes.
 * The request is cancelled if the component unmounts or the key changes first.
 */
export function useApiQuery<T>(fetcher: (signal: AbortSignal) => Promise<T>, key: string): ApiQuery<T> {
  const [state, setState] = useState<QueryState<T>>({ requestKey: '' })
  const [reloadCount, setReloadCount] = useState(0)
  const fetcherRef = useRef(fetcher)
  const requestKey = `${key}#${reloadCount}`

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    const controller = new AbortController()
    fetcherRef
      .current(controller.signal)
      .then((data) => setState({ requestKey, data }))
      .catch((error: unknown) => {
        if (!isCancelled(error)) {
          setState((previous) => ({ requestKey, data: previous.data, error: parseApiError(error) }))
        }
      })
    return () => controller.abort()
  }, [requestKey])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  return {
    data: state.data,
    error: state.requestKey === requestKey ? state.error : undefined,
    loading: state.requestKey !== requestKey,
    reload,
  }
}
