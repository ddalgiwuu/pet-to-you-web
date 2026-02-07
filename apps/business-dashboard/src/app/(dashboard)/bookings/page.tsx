"use client"

import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { AdvancedDataTable, Button } from "@pet-to-you/ui"
import { ColumnDef } from "@tanstack/react-table"
import { useBookings } from "@/hooks/useBusinessData"
import { Booking } from "@/lib/types"
import { useState } from "react"

export default function BookingsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const { data: bookings, isLoading, error } = useBookings({ date: selectedDate })
  // Define columns for the bookings table
  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "startTime",
      header: "시간",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.startTime}</span>
      ),
    },
    {
      accessorKey: "serviceName",
      header: "서비스",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.serviceName}</p>
          <p className="text-sm text-gray-500">{row.original.duration}분</p>
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "고객",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.customerName}</p>
          <p className="text-sm text-gray-500">{row.original.petName} ({row.original.petBreed})</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const statusMap = {
          confirmed: { bg: "bg-green-100", text: "text-green-700", label: "확정" },
          pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "대기" },
          in_progress: { bg: "bg-purple-100", text: "text-purple-700", label: "진행중" },
          completed: { bg: "bg-blue-100", text: "text-blue-700", label: "완료" },
          cancelled: { bg: "bg-red-100", text: "text-red-700", label: "취소" },
          no_show: { bg: "bg-gray-100", text: "text-gray-700", label: "노쇼" },
        }
        const status = statusMap[row.original.status]
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        )
      },
    },
    {
      accessorKey: "price",
      header: "금액",
      cell: ({ row }) => (
        <span className="font-semibold text-purple-600">
          ₩{row.original.price.toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "작업",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded">
            상세
          </button>
          {row.original.status === "confirmed" && (
            <button className="px-3 py-1 text-xs text-green-600 hover:bg-green-50 rounded">
              완료
            </button>
          )}
          {row.original.status === "pending" && (
            <button className="px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">
              확정
            </button>
          )}
        </div>
      ),
    },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500">예약 데이터 로딩 중...</p>
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
          <p className="text-red-700">예약 데이터를 불러올 수 없습니다.</p>
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

  const confirmedCount = bookings?.filter(b => b.status === 'confirmed').length || 0
  const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0
  const totalRevenue = bookings?.reduce((sum, b) => sum + b.price, 0) || 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">예약 & 일정</h1>
          <p className="text-gray-500 mt-1">예약을 관리하고 일정을 확인하세요</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          새 예약
        </Button>
      </div>

      {/* View selector and date navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
            일간
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            주간
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            월간
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-600" />
            <span className="font-medium">2026년 2월 7일 (금)</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Summary cards with real data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">확정</p>
          <p className="text-2xl font-bold text-green-900">{confirmedCount}건</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-yellow-700 font-medium">대기</p>
          <p className="text-2xl font-bold text-yellow-900">{pendingCount}건</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-700 font-medium">예상 수익</p>
          <p className="text-2xl font-bold text-purple-900">₩{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Bookings DataTable with real data */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          오늘의 예약 ({bookings?.length || 0}건)
        </h2>
        <AdvancedDataTable
          columns={columns}
          data={bookings || []}
          enableSorting
          enablePagination={false}
        />
      </div>
    </div>
  )
}
