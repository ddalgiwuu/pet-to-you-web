"use client"

/**
 * Revenue Page
 * Revenue analytics and financial reporting
 */

import { Card, CardHeader, CardTitle, CardContent, Badge, DataTable, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@pet-to-you/ui"
import { DollarSign, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { useRevenueData } from "@/hooks/useDashboardData"
import { RevenueChart } from "@/components/charts/RevenueChart"

export default function RevenuePage() {
  const { data: revenueData, isLoading, error } = useRevenueData('month')

  const revenue = revenueData || []

  // Calculate totals
  const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0)
  const totalBookings = revenue.reduce((sum, item) => sum + item.bookings, 0)
  const averagePerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0

  // Calculate week-over-week change (mock calculation)
  const lastWeekRevenue = totalRevenue * 0.85 // Mock: 15% growth
  const revenueChange = ((totalRevenue - lastWeekRevenue) / lastWeekRevenue) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">수익 분석</h1>
          <p className="text-gray-500 mt-1">병원의 수익 현황을 확인하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">수익 데이터를 불러오는 중...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-red-600">수익 데이터를 불러올 수 없습니다</div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">총 수익</span>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {(totalRevenue / 10000).toFixed(0)}만원
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {revenueChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">지난주 대비</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">예약 건수</span>
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalBookings}건</p>
                <p className="text-sm text-gray-500 mt-2">이번 달 총 예약</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">평균 단가</span>
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {(averagePerBooking / 10000).toFixed(0)}만원
                </p>
                <p className="text-sm text-gray-500 mt-2">건당 평균 수익</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">일 평균</span>
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {revenue.length > 0 ? (totalRevenue / revenue.length / 10000).toFixed(0) : 0}만원
                </p>
                <p className="text-sm text-gray-500 mt-2">하루 평균 수익</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <div className="grid grid-cols-1 gap-6">
            <RevenueChart data={revenue} />
          </div>

          {/* Daily Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>일별 상세 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>수익</TableHead>
                    <TableHead>예약 건수</TableHead>
                    <TableHead>평균 단가</TableHead>
                    <TableHead>전일 대비</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenue.map((item, index) => {
                    const prevItem = index > 0 ? revenue[index - 1] : null
                    const change = prevItem
                      ? ((item.amount - prevItem.amount) / prevItem.amount * 100)
                      : 0

                    return (
                      <TableRow key={item.date} animate>
                        <TableCell className="font-medium">{item.date}</TableCell>
                        <TableCell className="font-medium">
                          {item.amount.toLocaleString()}원
                        </TableCell>
                        <TableCell>{item.bookings}건</TableCell>
                        <TableCell>
                          {item.bookings > 0
                            ? (item.amount / item.bookings).toLocaleString()
                            : 0}원
                        </TableCell>
                        <TableCell>
                          {index > 0 ? (
                            <span className={`text-sm font-medium ${
                              change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </DataTable>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
