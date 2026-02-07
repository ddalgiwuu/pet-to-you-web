'use client'

import { useUserStore } from '@/lib/store'
import { useReviews } from '@/hooks/useDashboardData'
import { Star, ThumbsUp, MessageSquare } from 'lucide-react'

export default function ReviewsPage() {
  const { user } = useUserStore()
  const { data: reviews, isLoading } = useReviews(user?.role!)

  // Mock data
  const mockReviews = [
    { id: '1', customerName: 'John Doe', rating: 5, comment: 'Excellent service! My dog loved it.', date: '2026-02-08', service: 'Grooming' },
    { id: '2', customerName: 'Jane Smith', rating: 4, comment: 'Great experience, very professional staff.', date: '2026-02-07', service: 'Vet Checkup' },
    { id: '3', customerName: 'Bob Johnson', rating: 5, comment: 'Best pet care in town! Highly recommend.', date: '2026-02-06', service: 'Grooming' },
    { id: '4', customerName: 'Alice Brown', rating: 3, comment: 'Good service but a bit expensive.', date: '2026-02-05', service: 'Vaccination' },
  ]

  const displayReviews = reviews || mockReviews

  const averageRating = 4.5
  const totalReviews = 124

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
        <p className="text-gray-600">Manage and respond to customer feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Average Rating</p>
          <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">5-Star Reviews</p>
          <p className="text-3xl font-bold text-gray-900">89</p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Response Rate</p>
          <p className="text-3xl font-bold text-gray-900">96%</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Rating Distribution</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = rating === 5 ? 72 : rating === 4 ? 18 : rating === 3 ? 7 : rating === 2 ? 2 : 1
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium text-gray-900">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayReviews.map((review: any) => (
          <div key={review.id} className="glass-card rounded-xl p-6 animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{review.customerName}</h3>
                  <p className="text-sm text-gray-500">{review.service} • {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-gray-700 mb-4">{review.comment}</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-medium">
                Reply
              </button>
              <button className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
