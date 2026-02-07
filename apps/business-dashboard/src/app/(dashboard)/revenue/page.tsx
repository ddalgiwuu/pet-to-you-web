"use client"

import { DollarSign, TrendingUp, Calendar, CreditCard } from "lucide-react"
import { StatsCard, StatsChart, DonutChart } from "@pet-to-you/ui"
import { useRevenue, useBookings } from "@/hooks/useBusinessData"
import { useState } from "react"

export default function RevenuePage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly")
  const { data: revenueData, isLoading, error } = useRevenue({ period })

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500">수익 데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-600 text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-red-900">데이터 로딩 실패</h2>
          <p className="text-red-700">수익 데이터를 불러올 수 없습니다.</p>
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

  // Transform data for charts
  const bookingTrendsData = revenueData?.revenueByDay.map(item => ({
    name: item.day,
    value: item.bookings
  })) || []

  const paymentMethodsData = revenueData?.paymentMethods.map(item => ({
    name: item.method === 'card' ? '카드' : item.method === 'cash' ? '현금' : '계좌이체',
    value: item.percentage,
    color: item.method === 'card' ? '#9333ea' : item.method === 'cash' ? '#ec4899' : '#f59e0b'
  })) || []

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">매출 분석</h1>
        <p className="text-gray-500 mt-1">비즈니스 수익과 고객 인사이트를 확인하세요</p>
      </div>

      {/* Period selector with real data */}
      <div className="flex gap-2">
        {[
          { key: 'daily', label: '일간' },
          { key: 'weekly', label: '주간' },
          { key: 'monthly', label: '월간' },
          { key: 'yearly', label: '연간' }
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key as typeof period)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              period === p.key
                ? 'bg-purple-100 border-purple-200 text-purple-700'
                : 'border-gray-200 hover:bg-purple-50 hover:border-purple-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Revenue stats using @pet-to-you/ui with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="총 수익"
          value={`₩${revenueData?.totalRevenue.toLocaleString()}`}
          change={revenueData?.growthRate || 0}
          icon={DollarSign}
          index={0}
        />
        <StatsCard
          title="총 예약"
          value={`${revenueData?.totalBookings}건`}
          change={revenueData?.growthRate || 0}
          icon={Calendar}
          index={1}
        />
        <StatsCard
          title="평균 지불"
          value={`₩${revenueData?.averagePayment.toLocaleString()}`}
          icon={CreditCard}
          index={2}
        />
        <StatsCard
          title="성장률"
          value={`${revenueData?.growthRate > 0 ? '+' : ''}${revenueData?.growthRate.toFixed(1)}%`}
          icon={TrendingUp}
          index={3}
        />
      </div>

      {/* Revenue chart - Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">수익 추이 (최근 6개월)</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          차트가 여기 표시됩니다...
        </div>
      </div>

      {/* Insights grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top services with real data */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🏆 인기 서비스</h2>
          <div className="space-y-4">
            {revenueData?.revenueByService.slice(0, 3).map((service, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{service.serviceName}</p>
                  <p className="text-sm text-gray-500">{service.bookings} bookings</p>
                </div>
                <p className="font-bold text-purple-600">
                  ₩{(service.revenue / 10000).toFixed(0)}만
                </p>
              </div>
            )) || (
              <p className="text-center text-gray-500 py-4">서비스 데이터가 없습니다</p>
            )}
          </div>
        </div>

        {/* Booking trends using StatsChart */}
        <StatsChart
          data={bookingTrendsData}
          title="📅 예약 트렌드"
          type="bar"
          height={300}
          color="#9333ea"
        />

        {/* Payment methods using DonutChart */}
        <DonutChart
          data={paymentMethodsData}
          title="💳 결제 방법"
          size={250}
          centerText="100%"
        />

        {/* Customer insights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">👥 고객 인사이트</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">신규 고객</span>
              <span className="text-lg font-bold text-gray-900">12명</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">재방문 고객</span>
              <span className="text-lg font-bold text-gray-900">45명</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">휴면 고객 (>90일)</span>
              <span className="text-lg font-bold text-red-600">8명</span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">평균 방문 횟수</span>
                <span className="text-lg font-bold text-purple-600">2.4회</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">고객 유지율</span>
                <span className="text-lg font-bold text-green-600">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export actions */}
      <div className="flex gap-3">
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          📥 리포트 내보내기
        </button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          📧 이메일로 전송
        </button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          🖨️ 인쇄
        </button>
      </div>
    </div>
  )
}
