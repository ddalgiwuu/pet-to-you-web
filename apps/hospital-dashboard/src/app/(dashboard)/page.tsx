"use client"

import { DollarSign, Calendar, Users, Star } from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { RevenueChart } from "@/components/charts/RevenueChart"
import { BookingTable } from "@/components/dashboard/BookingTable"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import { useDashboardData, useRevenueData } from "@/hooks/useDashboardData"
import { useBookings } from "@/hooks/useBookings"
import type { DashboardStats } from "@/lib/api"

export default function DashboardPage() {
  // Fetch dashboard data
  const { data: dashboardData, isLoading: isLoadingDashboard, error: dashboardError } = useDashboardData()
  const { data: revenueData, isLoading: isLoadingRevenue } = useRevenueData()
  const { data: bookingsData, isLoading: isLoadingBookings } = useBookings({ limit: 10 })

  // Show loading state
  if (isLoadingDashboard || isLoadingRevenue || isLoadingBookings) {
    return <DashboardSkeleton />
  }

  // Show error state
  if (dashboardError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-red-600">데이터를 불러올 수 없습니다</p>
          <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요</p>
        </div>
      </div>
    )
  }

  // Extract data with fallbacks
  const stats: DashboardStats = dashboardData?.stats || {
    totalRevenue: 0,
    revenueChange: 0,
    totalBookings: 0,
    bookingsChange: 0,
    totalPatients: 0,
    patientsChange: 0,
    averageRating: 0,
    ratingChange: 0,
  }
  const revenue = revenueData || []
  const bookings = bookingsData?.bookings || []
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-1">오늘의 병원 현황을 확인하세요</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="총 수익"
          value={`${((stats.totalRevenue || 0) / 10000).toFixed(0)}만원`}
          change={stats.revenueChange || 0}
          icon={DollarSign}
          index={0}
        />
        <StatsCard
          title="예약 수"
          value={`${stats.totalBookings || 0}건`}
          change={stats.bookingsChange || 0}
          icon={Calendar}
          index={1}
        />
        <StatsCard
          title="환자 수"
          value={`${stats.totalPatients || 0}명`}
          change={stats.patientsChange || 0}
          icon={Users}
          index={2}
        />
        <StatsCard
          title="평균 평점"
          value={(stats.averageRating || 0).toFixed(1)}
          change={stats.ratingChange || 0}
          icon={Star}
          index={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenue} />
        {/* TODO: Add second chart type (e.g., patient distribution, service breakdown) */}
        <div className="flex items-center justify-center h-[350px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-400 text-sm">추가 차트 예정</p>
        </div>
      </div>

      {/* Bookings table */}
      <BookingTable bookings={bookings} />
    </div>
  )
}
