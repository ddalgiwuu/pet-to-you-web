"use client"

import { Card, CardHeader, CardTitle, CardContent, Badge, DataTable, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@pet-to-you/ui"
import { Booking } from "@/lib/types"

interface BookingTableProps {
  bookings: Booking[]
}

export function BookingTable({ bookings }: BookingTableProps) {
  const getStatusBadge = (status: Booking['status']) => {
    const variants = {
      pending: 'warning' as const,
      confirmed: 'default' as const,
      completed: 'success' as const,
      cancelled: 'error' as const,
    }

    const labels = {
      pending: '대기중',
      confirmed: '확정',
      completed: '완료',
      cancelled: '취소',
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>오늘의 예약</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable>
          <TableHeader>
            <TableRow>
              <TableHead>보호자</TableHead>
              <TableHead>반려동물</TableHead>
              <TableHead>서비스</TableHead>
              <TableHead>시간</TableHead>
              <TableHead>금액</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking, index) => (
              <TableRow key={booking.id} animate>
                <TableCell className="font-medium">{booking.patientName}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.petName}</p>
                    <p className="text-xs text-gray-500">{booking.petType}</p>
                  </div>
                </TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell className="font-medium">
                  {booking.amount.toLocaleString()}원
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </CardContent>
    </Card>
  )
}
