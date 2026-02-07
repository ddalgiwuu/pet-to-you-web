"use client"

import { Plus, Search, TrendingUp, Calendar } from "lucide-react"
import { Button, ServiceCard } from "@pet-to-you/ui"
import { useServices } from "@/hooks/useBusinessData"
import { useState } from "react"

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: services, isLoading, error } = useServices()

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500">서비스 데이터 로딩 중...</p>
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
          <p className="text-red-700">서비스 데이터를 불러올 수 없습니다.</p>
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

  // Filter services by search term
  const filteredServices = services?.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">서비스 관리</h1>
          <p className="text-gray-500 mt-1">서비스를 관리하고 새로운 서비스를 추가하세요</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          새 서비스
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="서비스 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">활성 서비스</p>
          <p className="text-2xl font-bold text-gray-900">{services?.filter(s => s.isActive).length}개</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">이번 달 총 예약</p>
          <p className="text-2xl font-bold text-purple-600">
            {services?.reduce((sum, s) => sum + s.bookingsThisMonth, 0)}건
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">이번 달 수익</p>
          <p className="text-2xl font-bold text-gray-900">
            ₩{services?.reduce((sum, s) => sum + s.revenueThisMonth, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Services grid with ServiceCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                service.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {service.isActive ? '활성' : '비활성'}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

            {/* Stats */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  이번 달 예약
                </span>
                <span className="font-medium text-gray-900">{service.bookingsThisMonth}건</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  수익
                </span>
                <span className="font-medium text-purple-600">
                  ₩{service.revenueThisMonth.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Price and Duration */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-lg font-bold text-purple-600">₩{service.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500">{service.duration}분</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">
                수정
              </button>
              <button className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                통계
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  )
}
