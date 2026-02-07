"use client"

import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@pet-to-you/ui"
import { Star, MessageSquare } from "lucide-react"
import { useReviews } from "@/hooks/useReviews"
import { motion } from "framer-motion"

export default function ReviewsPage() {
  const { data, isLoading, error } = useReviews()

  const reviews = data?.reviews || []
  const averageRating = data?.averageRating || 0
  const totalReviews = data?.total || 0

  // Count reviews needing reply
  const needsReply = reviews.filter(r => !r.reply).length
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">리뷰 관리</h1>
          <p className="text-gray-500 mt-1">고객 리뷰를 확인하고 답변하세요</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">데이터를 불러올 수 없습니다</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">총 {totalReviews}개의 리뷰</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {totalReviews > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100) : 0}%
                  </div>
                  <p className="text-sm text-gray-500 mt-2">긍정적인 리뷰</p>
                  <Badge variant={averageRating >= 4.5 ? "success" : "default"} className="mt-2">
                    {averageRating >= 4.5 ? "우수" : "양호"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600">{needsReply}</div>
                  <p className="text-sm text-gray-500 mt-2">답변 대기중</p>
                  {needsReply > 0 && (
                    <Button variant="outline" size="sm" className="mt-2">
                      답변하기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{review.patientName}</p>
                        <p className="text-sm text-gray-500">
                          {review.petName} · {review.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    {review.reply && (
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          병원 답변
                        </p>
                        <p className="text-sm text-blue-800">{review.reply}</p>
                      </div>
                    )}
                  </div>
                  {!review.reply && (
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      답변하기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
