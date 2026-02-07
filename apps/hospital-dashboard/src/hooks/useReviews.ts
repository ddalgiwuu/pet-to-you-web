/**
 * Reviews Hook
 * React Query hooks for review management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi, type ReviewsFilters } from '@/lib/api'
import { useSession } from 'next-auth/react'

/**
 * Get reviews list
 */
export function useReviews(filters?: ReviewsFilters) {
  const { data: session } = useSession()
  const hospitalId = session?.user?.hospitalId

  return useQuery({
    queryKey: ['reviews', hospitalId, filters],
    queryFn: () => reviewsApi.getList(hospitalId!, filters),
    enabled: !!hospitalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get single review by ID
 */
export function useReview(reviewId: string) {
  const { data: session } = useSession()
  const hospitalId = session?.user?.hospitalId

  return useQuery({
    queryKey: ['review', hospitalId, reviewId],
    queryFn: () => reviewsApi.getById(hospitalId!, reviewId),
    enabled: !!hospitalId && !!reviewId,
  })
}

/**
 * Reply to review mutation
 */
export function useReplyToReview() {
  const { data: session } = useSession()
  const hospitalId = session?.user?.hospitalId
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      reviewsApi.reply(hospitalId!, reviewId, reply),
    onSuccess: (_, variables) => {
      // Invalidate reviews list
      queryClient.invalidateQueries({ queryKey: ['reviews', hospitalId] })
      // Update specific review in cache
      queryClient.invalidateQueries({ queryKey: ['review', hospitalId, variables.reviewId] })
      // Update dashboard stats (average rating might change)
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'complete', hospitalId] })
    },
  })
}
