/**
 * Bookings Hook
 * React Query hooks for booking management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi, type BookingsFilters } from '@/lib/api'
import { useSession } from 'next-auth/react'

/**
 * Get bookings list
 */
export function useBookings(filters?: BookingsFilters) {
  const { data: session } = useSession()
  const hospitalId = session?.user?.hospitalId

  return useQuery({
    queryKey: ['bookings', hospitalId, filters],
    queryFn: () => bookingsApi.getList(hospitalId!, filters),
    enabled: !!hospitalId,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for bookings)
  })
}

/**
 * Get single booking by ID
 */
export function useBooking(bookingId: string) {
  const { data: session } = useSession()
  const hospitalId = session?.user?.hospitalId

  return useQuery({
    queryKey: ['booking', hospitalId, bookingId],
    queryFn: () => bookingsApi.getById(hospitalId!, bookingId),
    enabled: !!hospitalId && !!bookingId,
  })
}

/**
 * Complete booking mutation
 */
export function useCompleteBooking() {
  const { data: session } = useSession()
  const hospitalId = session?.user?.hospitalId
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingsApi.complete(hospitalId!, bookingId),
    onSuccess: () => {
      // Invalidate bookings list to refetch
      queryClient.invalidateQueries({ queryKey: ['bookings', hospitalId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'complete', hospitalId] })
    },
  })
}

/**
 * Cancel booking mutation
 */
export function useCancelBooking() {
  const { data: session } = useSession()
  const hospitalId = session?.user?.hospitalId
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      bookingsApi.cancel(hospitalId!, bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', hospitalId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'complete', hospitalId] })
    },
  })
}
