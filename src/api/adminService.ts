import { apiClient } from './client'
import type { ApiResponse, PageResponse, User, UserStatusFilter } from './types'

const BASE = '/api/v1/admin'

export interface UserQuery {
  /** Starts at 1. */
  page: number
  size: number
  /** Part of a name or email; empty means everyone. */
  search: string
  status: UserStatusFilter
}

export async function getUsers(query: UserQuery, signal?: AbortSignal): Promise<PageResponse<User>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<User>>>(`${BASE}/accounts`, {
    params: {
      page: query.page,
      size: query.size,
      status: query.status,
      search: query.search || undefined,
    },
    signal,
  })
  return data.data as PageResponse<User>
}

/** Logs the user out and turns off all their links. Can be undone with activateUser. */
export async function deactivateUser(userId: string): Promise<void> {
  await apiClient.put(`${BASE}/account/deactivate`, null, { params: { userId } })
}

export async function activateUser(userId: string): Promise<void> {
  await apiClient.put(`${BASE}/account/activate`, null, { params: { userId } })
}
