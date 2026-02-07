import { apiClient } from "./client"
import type {
  DashboardStats,
  Service,
  Booking,
  Customer,
  RevenueData,
  ApiResponse,
} from "@/lib/types"

/**
 * Business Dashboard API Client
 *
 * Available endpoints:
 * - GET /dashboard/business/stats - Dashboard statistics
 * - GET /dashboard/business/services - Service management
 * - GET /dashboard/business/bookings - Booking management
 * - GET /dashboard/business/customers - Customer management
 * - GET /dashboard/business/revenue - Revenue analytics
 */

export const businessApi = {
  /**
   * Get dashboard statistics
   * Returns: today's revenue, bookings, customers, ratings with changes
   */
  getStats: async () => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>(
      "/dashboard/business/stats"
    )
    return data.data
  },

  /**
   * Get all services
   * Returns: list of services with pricing, popularity, bookings
   */
  getServices: async () => {
    const { data } = await apiClient.get<ApiResponse<Service[]>>(
      "/dashboard/business/services"
    )
    return data.data
  },

  /**
   * Get service by ID
   */
  getService: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Service>>(
      `/dashboard/business/services/${id}`
    )
    return data.data
  },

  /**
   * Create new service
   */
  createService: async (service: Omit<Service, "id">) => {
    const { data } = await apiClient.post<ApiResponse<Service>>(
      "/dashboard/business/services",
      service
    )
    return data.data
  },

  /**
   * Update service
   */
  updateService: async (id: string, service: Partial<Service>) => {
    const { data } = await apiClient.patch<ApiResponse<Service>>(
      `/dashboard/business/services/${id}`,
      service
    )
    return data.data
  },

  /**
   * Delete service
   */
  deleteService: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `/dashboard/business/services/${id}`
    )
    return data
  },

  /**
   * Get all bookings
   * Optional query params: date, status
   */
  getBookings: async (params?: { date?: string; status?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Booking[]>>(
      "/dashboard/business/bookings",
      { params }
    )
    return data.data
  },

  /**
   * Get booking by ID
   */
  getBooking: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Booking>>(
      `/dashboard/business/bookings/${id}`
    )
    return data.data
  },

  /**
   * Create new booking
   */
  createBooking: async (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => {
    const { data } = await apiClient.post<ApiResponse<Booking>>(
      "/dashboard/business/bookings",
      booking
    )
    return data.data
  },

  /**
   * Update booking
   */
  updateBooking: async (id: string, booking: Partial<Booking>) => {
    const { data } = await apiClient.patch<ApiResponse<Booking>>(
      `/dashboard/business/bookings/${id}`,
      booking
    )
    return data.data
  },

  /**
   * Delete booking
   */
  deleteBooking: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `/dashboard/business/bookings/${id}`
    )
    return data
  },

  /**
   * Get all customers
   */
  getCustomers: async () => {
    const { data } = await apiClient.get<ApiResponse<Customer[]>>(
      "/dashboard/business/customers"
    )
    return data.data
  },

  /**
   * Get customer by ID
   */
  getCustomer: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Customer>>(
      `/dashboard/business/customers/${id}`
    )
    return data.data
  },

  /**
   * Create new customer
   */
  createCustomer: async (customer: Omit<Customer, "id" | "joinedDate" | "totalVisits" | "totalSpent" | "lastVisit" | "status" | "loyaltyTier">) => {
    const { data } = await apiClient.post<ApiResponse<Customer>>(
      "/dashboard/business/customers",
      customer
    )
    return data.data
  },

  /**
   * Update customer
   */
  updateCustomer: async (id: string, customer: Partial<Customer>) => {
    const { data } = await apiClient.patch<ApiResponse<Customer>>(
      `/dashboard/business/customers/${id}`,
      customer
    )
    return data.data
  },

  /**
   * Delete customer
   */
  deleteCustomer: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `/dashboard/business/customers/${id}`
    )
    return data
  },

  /**
   * Get revenue analytics
   * Optional query params: period (daily, weekly, monthly, yearly)
   */
  getRevenue: async (params?: { period?: "daily" | "weekly" | "monthly" | "yearly" }) => {
    const { data } = await apiClient.get<ApiResponse<RevenueData>>(
      "/dashboard/business/revenue",
      { params }
    )
    return data.data
  },
}
