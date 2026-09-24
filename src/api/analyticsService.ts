import { apiClient } from './client'
import type { UrlStats } from './types'

/** analytics-service returns the stats directly, without the ApiResponse wrapper. */
export async function getUrlStats(shortCode: string, signal?: AbortSignal): Promise<UrlStats> {
  const { data } = await apiClient.get<UrlStats>(`/api/v1/analytics/${encodeURIComponent(shortCode)}`, { signal })
  return data
}
