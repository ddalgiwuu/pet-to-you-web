"use client"

/**
 * Schedule Page
 * Daily appointment schedule view for hospital staff
 */

import { Card, CardHeader, CardTitle, CardContent, Badge } from "@pet-to-you/ui"
import { Calendar, Clock, MapPin } from "lucide-react"
import { useBookings } from "@/hooks/useBookings"

export default function SchedulePage() {
  const { data, isLoading, error } = useBookings({
    status: 'confirmed',
    limit: 50
  })

  const bookings = data?.bookings || []

  // Group bookings by time
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const getBookingsForTimeSlot = (time: string) => {
    return bookings.filter(b => b.time.startsWith(time.substring(0, 2)))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">진료 일정</h1>
          <p className="text-gray-500 mt-1">오늘의 예약 일정을 확인하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-sm">
            오늘: {new Date().toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}
          </Badge>
        </div>
      </div>

      {/* Loading/Error States */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">일정을 불러오는 중...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-red-600">일정을 불러올 수 없습니다</div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">오늘 예약</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">완료</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => b.status === 'completed').length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">대기중</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => b.status === 'confirmed').length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>일정 타임라인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSlots.map((time) => {
                  const slotBookings = getBookingsForTimeSlot(time)
                  const isEmpty = slotBookings.length === 0

                  return (
                    <div key={time} className="flex gap-4">
                      {/* Time Label */}
                      <div className="w-20 flex-shrink-0">
                        <div className="text-sm font-medium text-gray-900">{time}</div>
                        <div className="text-xs text-gray-500">
                          {slotBookings.length > 0 ? `${slotBookings.length}건` : '비어있음'}
                        </div>
                      </div>

                      {/* Bookings for this time slot */}
                      <div className="flex-1">
                        {isEmpty ? (
                          <div className="h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-sm text-gray-400">예약 없음</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {slotBookings.map((booking) => (
                              <Card key={booking.id} className="border-l-4 border-blue-500">
                                <CardContent className="py-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-900">{booking.petName}</p>
                                        <span className="text-sm text-gray-500">({booking.petType})</span>
                                      </div>
                                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                        <span>보호자: {booking.patientName}</span>
                                        <span>•</span>
                                        <span>{booking.service}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Badge variant={
                                        booking.status === 'completed' ? 'success' :
                                        booking.status === 'confirmed' ? 'default' :
                                        'warning'
                                      }>
                                        {booking.status === 'completed' ? '완료' :
                                         booking.status === 'confirmed' ? '확정' :
                                         '대기'}
                                      </Badge>
                                      <span className="text-sm font-medium text-gray-900">
                                        {booking.amount.toLocaleString()}원
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
