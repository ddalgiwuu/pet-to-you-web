/**
 * API Client Configuration
 * Axios instance with JWT interceptors and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor: Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or cookie
    // TODO: Update to use NextAuth session token when available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin'
          }
          break

        case 403:
          // Forbidden - insufficient permissions
          console.error('Permission denied:', error.response.data)
          break

        case 404:
          // Not found
          console.error('Resource not found:', error.config?.url)
          break

        case 500:
          // Server error
          console.error('Server error:', error.response.data)
          break

        default:
          console.error('API error:', error.response.data)
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server')
    } else {
      // Error in request configuration
      console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  }
)

/**
 * API Error type
 */
export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

/**
 * Helper to extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError
    return apiError?.message || error.message || 'An error occurred'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}
