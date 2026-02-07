/**
 * Dashboard Data Hook
 * React Query hook for dashboard statistics and data
 */

import { useQuery } from '@tanstack/react-query'
import { dashboardApi, type DashboardResponse, type DashboardStats } from '@/lib/api'
import { useSession } from 'next-auth/react'
import type { Revenue } from '@/lib/types'

/**
 * Get dashboard statistics
 */
export function useDashboardStats() {
  const { data: session } = useSession()
  const hospitalId = session?.user?.organizationId

  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats', hospitalId],
    queryFn: () => dashboardApi.getStats(hospitalId!),
    enabled: !!hospitalId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  })
}

/**
 * Get revenue data
 */
export function useRevenueData(period?: string) {
  const { data: session } = useSession()
  const hospitalId = session?.user?.organizationId

  return useQuery<Revenue[]>({
    queryKey: ['dashboard', 'revenue', hospitalId, period],
    queryFn: () => dashboardApi.getRevenue(hospitalId!, period),
    enabled: !!hospitalId,
    staleTime: 3 * 60 * 1000,
  })
}

/**
 * Get complete dashboard data (optimized)
 * Uses BFF endpoint for single API call
 */
export function useDashboardData() {
  const { data: session } = useSession()
  const hospitalId = session?.user?.organizationId

  return useQuery<DashboardResponse>({
    queryKey: ['dashboard', 'complete', hospitalId],
    queryFn: () => dashboardApi.getDashboard(hospitalId!),
    enabled: !!hospitalId,
    staleTime: 3 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
