/**
 * React Query Client Configuration
 * Optimized settings for hospital dashboard data fetching
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data considered fresh for 3 minutes (matches BFF cache)
      staleTime: 3 * 60 * 1000,

      // Cache time: Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,

      // Retry failed requests 2 times with exponential backoff
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Network mode: online only (no offline support yet)
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once
      retry: 1,

      // Network mode for mutations
      networkMode: 'online',
    },
  },
})
