"use client"

import { Card, CardHeader, CardTitle, CardContent, Badge, DataTable, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input } from "@pet-to-you/ui"
import { Search, Filter } from "lucide-react"
import { useBookings } from "@/hooks/useBookings"
import { useState } from "react"

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>()

  const { data, isLoading, error } = useBookings({
    status: statusFilter as any,
    limit: 50
  })

  const bookings = data?.bookings || []

  // Filter bookings by search query (client-side)
  const filteredBookings = bookings.filter(booking =>
    booking.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.petName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'default' | 'success' | 'error'> = {
      pending: 'warning',
      confirmed: 'default',
      completed: 'success',
      cancelled: 'error',
    }

    const labels: Record<string, string> = {
      pending: '대기중',
      confirmed: '확정',
      completed: '완료',
      cancelled: '취소',
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">예약 관리</h1>
          <p className="text-gray-500 mt-1">모든 예약을 관리하고 확인하세요</p>
        </div>
        <Button>
          새 예약 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>전체 예약 ({filteredBookings.length}건)</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="검색..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-600">데이터를 불러올 수 없습니다</div>
            </div>
          ) : (
            <DataTable>
              <TableHeader>
                <TableRow>
                  <TableHead>예약번호</TableHead>
                  <TableHead>보호자</TableHead>
                  <TableHead>반려동물</TableHead>
                  <TableHead>서비스</TableHead>
                  <TableHead>날짜</TableHead>
                  <TableHead>시간</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                <TableRow key={booking.id} animate>
                  <TableCell className="font-medium">#{booking.id}</TableCell>
                  <TableCell>{booking.patientName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.petName}</p>
                      <p className="text-xs text-gray-500">{booking.petType}</p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell className="font-medium">
                    {booking.amount.toLocaleString()}원
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      상세보기
                    </Button>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </DataTable>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
