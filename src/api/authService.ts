import { apiClient } from './client'
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from './types'

const BASE = '/api/v1/user'

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<ApiResponse<RegisterResponse>>(`${BASE}/register`, request)
  return data.data as RegisterResponse
}

/** Sets the HttpOnly login cookie; the token itself is never exposed to JavaScript. */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(`${BASE}/login`, request)
  return data.data as LoginResponse
}

export async function logout(): Promise<void> {
  await apiClient.post(`${BASE}/logout`)
}

export async function getCurrentUser(signal?: AbortSignal): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(`${BASE}/me`, { signal })
  return data.data as User
}
