import { useQuery } from '@tanstack/react-query'
import { api, getEndpoint } from '@/lib/api'
import type { DashboardStats, UserRole } from '@/types'

export const useDashboardData = (role: UserRole) => {
  return useQuery({
    queryKey: ['dashboard', role],
    queryFn: async () => {
      const endpoint = getEndpoint(role, 'dashboard/stats')
      const response = await api.get<DashboardStats>(endpoint)
      return response.data
    },
  })
}

export const useBookings = (role: UserRole) => {
  return useQuery({
    queryKey: ['bookings', role],
    queryFn: async () => {
      const endpoint = getEndpoint(role, 'bookings')
      const response = await api.get(endpoint)
      return response.data
    },
  })
}

export const useCustomers = (role: UserRole) => {
  return useQuery({
    queryKey: ['customers', role],
    queryFn: async () => {
      const endpoint = getEndpoint(role, 'customers')
      const response = await api.get(endpoint)
      return response.data
    },
  })
}

export const useRevenue = (role: UserRole) => {
  return useQuery({
    queryKey: ['revenue', role],
    queryFn: async () => {
      const endpoint = getEndpoint(role, 'revenue')
      const response = await api.get(endpoint)
      return response.data
    },
  })
}

export const useReviews = (role: UserRole) => {
  return useQuery({
    queryKey: ['reviews', role],
    queryFn: async () => {
      const endpoint = getEndpoint(role, 'reviews')
      const response = await api.get(endpoint)
      return response.data
    },
  })
}
