"use client"

import { Plus, Search, Filter, User } from "lucide-react"
import { AdvancedDataTable, Button } from "@pet-to-you/ui"
import { ColumnDef } from "@tanstack/react-table"
import { useCustomers } from "@/hooks/useBusinessData"
import { Customer } from "@/lib/types"
import { useState } from "react"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: customers, isLoading, error } = useCustomers()

  // Define columns for the customers table
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "고객명",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.original.name}</p>
            <p className="text-sm text-gray-500">{row.original.phone}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalVisits",
      header: "방문 횟수",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.totalVisits}회
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const statusMap: Record<string, { bg: string; text: string; label: string }> = {
          new: { bg: "bg-blue-100", text: "text-blue-700", label: "신규" },
          regular: { bg: "bg-green-100", text: "text-green-700", label: "단골" },
          vip: { bg: "bg-purple-100", text: "text-purple-700", label: "VIP" },
          dormant: { bg: "bg-gray-100", text: "text-gray-700", label: "휴면" },
        }
        const status = statusMap[row.original.status] || statusMap.new
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        )
      },
    },
    {
      accessorKey: "loyaltyTier",
      header: "등급",
      cell: ({ row }) => {
        const tierMap = {
          bronze: { icon: "🥉", label: "Bronze", color: "text-amber-700" },
          silver: { icon: "🥈", label: "Silver", color: "text-gray-700" },
          gold: { icon: "🥇", label: "Gold", color: "text-yellow-600" },
          platinum: { icon: "💎", label: "Platinum", color: "text-purple-600" },
        }
        const tier = tierMap[row.original.loyaltyTier]
        return (
          <span className={`text-sm font-medium ${tier.color}`}>
            {tier.icon} {tier.label}
          </span>
        )
      },
    },
    {
      accessorKey: "totalVisits",
      header: "방문",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.totalVisits}회</span>
      ),
    },
    {
      accessorKey: "totalSpent",
      header: "총 지출",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-purple-600">
          ₩{row.original.totalSpent.toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "작업",
      cell: ({ row }) => (
        <button className="px-3 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded">
          상세
        </button>
      ),
    },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500">고객 데이터 로딩 중...</p>
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
          <p className="text-red-700">고객 데이터를 불러올 수 없습니다.</p>
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

  // Filter customers by search term
  const filteredCustomers = customers?.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  ) || []

  // Calculate stats
  const newCustomers = customers?.filter(c => c.status === 'new').length || 0
  const vipCustomers = customers?.filter(c => c.loyaltyTier === 'platinum' || c.loyaltyTier === 'gold').length || 0
  const avgVisits = customers?.length
    ? (customers.reduce((sum, c) => sum + c.totalVisits, 0) / customers.length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">고객 관리</h1>
          <p className="text-gray-500 mt-1">고객 정보를 관리하고 반려동물 프로필을 확인하세요</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          새 고객
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="고객 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">신규 고객 (이번 달)</p>
          <p className="text-2xl font-bold text-gray-900">{newCustomers}명</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">VIP 고객</p>
          <p className="text-2xl font-bold text-purple-600">{vipCustomers}명</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">평균 방문 횟수</p>
          <p className="text-2xl font-bold text-gray-900">{avgVisits}회</p>
        </div>
      </div>

      {/* Customers DataTable */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          고객 목록 ({filteredCustomers.length}명)
        </h2>
        <AdvancedDataTable
          columns={columns}
          data={filteredCustomers}
          enableSorting
          enablePagination
        />
      </div>
    </div>
  )
}
