"use client"

import { Star, MessageSquare } from "lucide-react"

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">리뷰 관리</h1>
        <p className="text-gray-500 mt-1">고객 리뷰를 확인하고 답변하세요</p>
      </div>

      {/* Rating overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average rating */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">평균 평점</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-gray-900">4.8</div>
            <div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-500">총 156개 리뷰</p>
              <p className="text-sm text-green-600 font-medium">↑ +2.1% (지난달)</p>
            </div>
          </div>
        </div>

        {/* Rating distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">평점 분포</h2>
          <div className="space-y-2">
            {[
              { stars: 5, count: 122, percentage: 78 },
              { stars: 4, count: 23, percentage: 15 },
              { stars: 3, count: 8, percentage: 5 },
              { stars: 2, count: 2, percentage: 1 },
              { stars: 1, count: 1, percentage: 1 },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['전체', '답변 필요', '최근 리뷰', '높은 평점', '낮은 평점'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Reviews list - Placeholder */}
      <div className="space-y-4">
        {[
          { name: "김민수", rating: 5, service: "Full Grooming", pet: "Max", date: "2026-02-06", comment: "Max가 너무 예쁘게 변신했어요! 털도 부드럽고 향기도 좋네요.", hasReply: true },
          { name: "이지은", rating: 4, service: "Basic Wash", pet: "Luna", date: "2026-02-05", comment: "서비스는 좋았는데 조금 오래 기다렸어요.", hasReply: false },
          { name: "박준호", rating: 5, service: "Training Session", pet: "Charlie", date: "2026-02-04", comment: "Charlie가 이제 '앉아'와 '기다려'를 잘 따라해요!", hasReply: true },
        ].map((review, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            {/* Review header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{review.rating}.0</span>
                </div>
                <p className="font-medium text-gray-900">{review.name}</p>
                <p className="text-sm text-gray-500">
                  {review.service} ({review.pet})
                </p>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>

            {/* Comment */}
            <p className="text-gray-700 mb-4">{review.comment}</p>

            {/* Reply or reply button */}
            {review.hasReply ? (
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">답변</span>
                </div>
                <p className="text-sm text-purple-900">
                  감사합니다, {review.name}님! 항상 최선을 다하겠습니다. 다음 방문도 기대하겠습니다! 🐕
                </p>
                <p className="text-xs text-purple-600 mt-2">{review.date}</p>
              </div>
            ) : (
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                답변하기
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
