import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { businessApi } from "@/lib/api/business"
import type { Service, Booking, Customer } from "@/lib/types"

/**
 * React Query hooks for Business Dashboard API
 */

// Dashboard Stats
export function useBusinessStats() {
  return useQuery({
    queryKey: ["business", "stats"],
    queryFn: businessApi.getStats,
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Auto-refresh every minute
  })
}

// Services
export function useServices() {
  return useQuery({
    queryKey: ["business", "services"],
    queryFn: businessApi.getServices,
    staleTime: 300000, // 5 minutes
  })
}

export function useService(id: string) {
  return useQuery({
    queryKey: ["business", "services", id],
    queryFn: () => businessApi.getService(id),
    enabled: !!id,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: businessApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "services"] })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      businessApi.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "services"] })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: businessApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "services"] })
    },
  })
}

// Bookings
export function useBookings(params?: { date?: string; status?: string }) {
  return useQuery({
    queryKey: ["business", "bookings", params],
    queryFn: () => businessApi.getBookings(params),
    staleTime: 30000, // 30 seconds
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["business", "bookings", id],
    queryFn: () => businessApi.getBooking(id),
    enabled: !!id,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: businessApi.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "bookings"] })
      queryClient.invalidateQueries({ queryKey: ["business", "stats"] })
    },
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Booking> }) =>
      businessApi.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "bookings"] })
      queryClient.invalidateQueries({ queryKey: ["business", "stats"] })
    },
  })
}

export function useDeleteBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: businessApi.deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "bookings"] })
      queryClient.invalidateQueries({ queryKey: ["business", "stats"] })
    },
  })
}

// Customers
export function useCustomers() {
  return useQuery({
    queryKey: ["business", "customers"],
    queryFn: businessApi.getCustomers,
    staleTime: 300000, // 5 minutes
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["business", "customers", id],
    queryFn: () => businessApi.getCustomer(id),
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: businessApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "customers"] })
      queryClient.invalidateQueries({ queryKey: ["business", "stats"] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      businessApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "customers"] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: businessApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "customers"] })
      queryClient.invalidateQueries({ queryKey: ["business", "stats"] })
    },
  })
}

// Revenue
export function useRevenue(params?: { period?: "daily" | "weekly" | "monthly" | "yearly" }) {
  return useQuery({
    queryKey: ["business", "revenue", params],
    queryFn: () => businessApi.getRevenue(params),
    staleTime: 300000, // 5 minutes
  })
}
