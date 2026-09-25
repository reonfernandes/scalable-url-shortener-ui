import { apiClient } from './client'
import type { ClickCounts, UrlStats } from './types'

// analytics-service returns its data directly, without the ApiResponse wrapper.

export async function getUrlStats(urlId: number, signal?: AbortSignal): Promise<UrlStats> {
  const { data } = await apiClient.get<UrlStats>(`/api/v1/analytics/${urlId}`, { signal })
  return data
}

/** Total clicks for a page of links in one request. */
export async function getClickCounts(urlIds: number[], signal?: AbortSignal): Promise<ClickCounts> {
  if (urlIds.length === 0) return {}
  const { data } = await apiClient.get<ClickCounts>('/api/v1/analytics/clicks', {
    params: { urlIds: urlIds.join(',') },
    signal,
  })
  return data
}
