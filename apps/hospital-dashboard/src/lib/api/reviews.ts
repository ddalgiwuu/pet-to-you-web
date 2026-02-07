/**
 * Reviews API Service
 * Review and rating management
 */

import { apiClient } from './client'
import { Review } from '../types'

export interface ReviewsFilters {
  rating?: number
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export interface ReviewsResponse {
  reviews: Review[]
  total: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
}

/**
 * Get reviews list
 */
export async function getReviews(hospitalId: string, filters?: ReviewsFilters) {
  const response = await apiClient.get<ReviewsResponse>(
    `/dashboard/hospital/reviews`,
    {
      params: { hospitalId, ...filters }
    }
  )
  return response.data
}

/**
 * Get single review by ID
 */
export async function getReviewById(hospitalId: string, reviewId: string) {
  const response = await apiClient.get<Review>(
    `/dashboard/hospital/reviews/${reviewId}`,
    {
      params: { hospitalId }
    }
  )
  return response.data
}

/**
 * Reply to review
 */
export async function replyToReview(hospitalId: string, reviewId: string, reply: string) {
  const response = await apiClient.post(
    `/dashboard/hospital/reviews/${reviewId}/reply`,
    { reply },
    {
      params: { hospitalId }
    }
  )
  return response.data
}

export const reviewsApi = {
  getList: getReviews,
  getById: getReviewById,
  reply: replyToReview,
}
