/**
 * Dashboard API Service
 * Hospital dashboard data fetching
 */

import { apiClient } from './client'
import { Stats, Revenue } from '../types'

export interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalBookings: number
  bookingsChange: number
  totalPatients: number
  patientsChange: number
  averageRating: number
  ratingChange: number
}

export interface DashboardResponse {
  stats: DashboardStats
  revenue: Revenue[]
  recentBookings: any[]
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(hospitalId: string) {
  const response = await apiClient.get<DashboardStats>(
    `/dashboard/hospital/stats`,
    {
      params: { hospitalId }
    }
  )
  return response.data
}

/**
 * Get revenue data
 */
export async function getRevenueData(hospitalId: string, period?: string) {
  const response = await apiClient.get<Revenue[]>(
    `/dashboard/hospital/revenue`,
    {
      params: { hospitalId, period }
    }
  )
  return response.data
}

/**
 * Get complete dashboard data (optimized BFF endpoint)
 */
export async function getDashboardData(hospitalId: string) {
  const response = await apiClient.get<DashboardResponse>(
    `/bff/hospital/dashboard`,
    {
      params: { hospitalId }
    }
  )
  return response.data
}

export const dashboardApi = {
  getStats: getDashboardStats,
  getRevenue: getRevenueData,
  getDashboard: getDashboardData,
}
