/**
 * Bookings API Service
 * Appointment and booking management
 */

import { apiClient } from './client'
import { Booking } from '../types'

export interface BookingsFilters {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export interface BookingsResponse {
  bookings: Booking[]
  total: number
  page: number
  pageSize: number
}

/**
 * Get bookings list
 */
export async function getBookings(hospitalId: string, filters?: BookingsFilters) {
  const response = await apiClient.get<BookingsResponse>(
    `/dashboard/hospital/appointments`,
    {
      params: { hospitalId, ...filters }
    }
  )
  return response.data
}

/**
 * Get single booking by ID
 */
export async function getBookingById(hospitalId: string, bookingId: string) {
  const response = await apiClient.get<Booking>(
    `/dashboard/hospital/appointments/${bookingId}`,
    {
      params: { hospitalId }
    }
  )
  return response.data
}

/**
 * Complete booking
 */
export async function completeBooking(hospitalId: string, bookingId: string) {
  const response = await apiClient.patch(
    `/dashboard/hospital/appointments/${bookingId}/complete`,
    {},
    {
      params: { hospitalId }
    }
  )
  return response.data
}

/**
 * Cancel booking
 */
export async function cancelBooking(hospitalId: string, bookingId: string, reason?: string) {
  const response = await apiClient.patch(
    `/dashboard/hospital/appointments/${bookingId}/cancel`,
    { reason },
    {
      params: { hospitalId }
    }
  )
  return response.data
}

export const bookingsApi = {
  getList: getBookings,
  getById: getBookingById,
  complete: completeBooking,
  cancel: cancelBooking,
}
