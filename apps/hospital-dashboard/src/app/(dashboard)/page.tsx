"use client"

import { DollarSign, Calendar, Users, Star } from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { RevenueChart } from "@/components/charts/RevenueChart"
import { BookingTable } from "@/components/dashboard/BookingTable"
import { mockStats, mockBookings, mockRevenue } from "@/lib/mock-data"

export default function DashboardPage() {
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
          value={`${(mockStats.totalRevenue / 10000).toFixed(0)}만원`}
          change={mockStats.revenueChange}
          icon={DollarSign}
          index={0}
        />
        <StatsCard
          title="예약 수"
          value={`${mockStats.totalBookings}건`}
          change={mockStats.bookingsChange}
          icon={Calendar}
          index={1}
        />
        <StatsCard
          title="환자 수"
          value={`${mockStats.totalPatients}명`}
          change={mockStats.patientsChange}
          icon={Users}
          index={2}
        />
        <StatsCard
          title="평균 평점"
          value={mockStats.averageRating.toFixed(1)}
          change={mockStats.ratingChange}
          icon={Star}
          index={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={mockRevenue} />
        <RevenueChart data={mockRevenue} />
      </div>

      {/* Bookings table */}
      <BookingTable bookings={mockBookings} />
    </div>
  )
}
