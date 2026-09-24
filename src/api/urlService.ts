import { apiClient } from './client'
import type {
  ApiResponse,
  CreateUrlRequest,
  PageResponse,
  ShortUrl,
  UnlockUrlResponse,
  UpdateUrlRequest,
} from './types'

const BASE = '/api/v1/url'

export async function getMyUrls(page: number, size: number, signal?: AbortSignal): Promise<PageResponse<ShortUrl>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<ShortUrl>>>(`${BASE}/my-urls`, {
    params: { page, size },
    signal,
  })
  return data.data as PageResponse<ShortUrl>
}

export async function createUrl(request: CreateUrlRequest): Promise<ShortUrl> {
  const { data } = await apiClient.post<ApiResponse<ShortUrl>>(`${BASE}/new`, request)
  return data.data as ShortUrl
}

export async function updateUrl(urlId: number, request: UpdateUrlRequest): Promise<void> {
  await apiClient.patch(`${BASE}/update-url`, request, { params: { urlId } })
}

export async function deleteUrl(urlId: number): Promise<void> {
  await apiClient.delete(`${BASE}/delete-url`, { params: { urlId } })
}

/** Checks the password of a protected link and returns where it points to. */
export async function unlockUrl(shortCode: string, password: string): Promise<UnlockUrlResponse> {
  const { data } = await apiClient.post<ApiResponse<UnlockUrlResponse>>(
    `/api/v1/redirect/${encodeURIComponent(shortCode)}`,
    { password },
  )
  return data.data as UnlockUrlResponse
}
