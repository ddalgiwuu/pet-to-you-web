"use client"

import { DollarSign, Calendar, Users, Star, Plus, Camera, MessageSquare, FileText } from "lucide-react"
import { StatsCard, RevenueChart, ActionCard, InfoCard } from "@pet-to-you/ui"
import { useBusinessStats, useBookings, useRevenue } from "@/hooks/useBusinessData"

export default function DashboardPage() {
  // Fetch real data from API
  const { data: stats, isLoading: statsLoading, error: statsError } = useBusinessStats()
  const { data: todayBookings, isLoading: bookingsLoading } = useBookings({
    date: new Date().toISOString().split('T')[0]
  })
  const { data: revenueData, isLoading: revenueLoading } = useRevenue({ period: "weekly" })

  // Loading state
  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500">대시보드 데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-600 text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-red-900">데이터 로딩 실패</h2>
          <p className="text-red-700">대시보드 데이터를 불러올 수 없습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-1">오늘의 비즈니스 현황을 확인하세요</p>
      </div>

      {/* Stats cards using @pet-to-you/ui with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="오늘 수익"
          value={`₩${stats?.todayRevenue.toLocaleString()}`}
          change={stats?.revenueChange || 0}
          icon={DollarSign}
          index={0}
        />
        <StatsCard
          title="오늘 예약"
          value={`${stats?.todayBookings}건`}
          change={stats?.bookingsChange || 0}
          icon={Calendar}
          index={1}
        />
        <StatsCard
          title="총 고객"
          value={`${stats?.totalCustomers}명`}
          change={stats?.customersChange || 0}
          icon={Users}
          index={2}
        />
        <StatsCard
          title="평균 평점"
          value={(stats?.averageRating || 0).toFixed(1)}
          change={stats?.ratingChange || 0}
          icon={Star}
          index={3}
        />
      </div>

      {/* Today's schedule with real data */}
      <InfoCard
        title="오늘의 일정"
        description={bookingsLoading ? "로딩 중..." : `${todayBookings?.length || 0}개 예약`}
      >
        <div className="space-y-3">
          {bookingsLoading ? (
            <div className="text-center py-8 text-gray-500">예약 정보 로딩 중...</div>
          ) : todayBookings && todayBookings.length > 0 ? (
            todayBookings.slice(0, 4).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.startTime} - {booking.serviceName}</p>
                  <p className="text-xs text-gray-500">{booking.customerName} - {booking.petName}</p>
                </div>
                <button className="text-xs text-purple-600 hover:text-purple-700">상세</button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">오늘 예약이 없습니다</div>
          )}
        </div>
      </InfoCard>

      {/* Charts and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart using @pet-to-you/ui with real data */}
        {revenueLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-[300px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500">수익 차트 로딩 중...</p>
            </div>
          </div>
        ) : revenueData ? (
          <RevenueChart
            data={revenueData.revenueByDay.map(item => ({
              date: item.day,
              amount: item.revenue
            }))}
            title="주간 수익"
            height={300}
            color="#9333ea"
            formatValue={(v) => `₩${v.toLocaleString()}`}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-[300px] flex items-center justify-center">
            <p className="text-gray-500">수익 데이터가 없습니다</p>
          </div>
        )}

        {/* Quick actions using @pet-to-you/ui */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">빠른 작업</h2>
          <div className="grid grid-cols-1 gap-4">
            <ActionCard
              title="새 예약 추가"
              description="고객 예약을 빠르게 등록하세요"
              icon={Plus}
              action={{
                label: "예약 추가",
                onClick: () => console.log("Add booking"),
                variant: "default",
              }}
            />
            <ActionCard
              title="사진 업로드"
              description="Before/After 사진을 업로드하세요"
              icon={Camera}
              action={{
                label: "업로드",
                onClick: () => console.log("Upload photo"),
                variant: "outline",
              }}
            />
            <ActionCard
              title="리뷰 답변하기"
              description="새로운 리뷰에 답변하세요 (3개 대기)"
              icon={MessageSquare}
              action={{
                label: "답변하기",
                onClick: () => console.log("Reply reviews"),
                variant: "outline",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
