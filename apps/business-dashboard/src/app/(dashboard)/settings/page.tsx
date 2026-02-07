"use client"

import { Building2, Clock, Bell, CreditCard, Users, User } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-500 mt-1">비즈니스 정보와 운영 설정을 관리하세요</p>
      </div>

      {/* Settings tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { name: "비즈니스 정보", icon: Building2 },
          { name: "운영 시간", icon: Clock },
          { name: "알림 설정", icon: Bell },
          { name: "결제 설정", icon: CreditCard },
          { name: "직원 관리", icon: Users },
          { name: "계정", icon: User },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.name}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600 transition-colors"
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Business information form - Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-purple-600" />
          비즈니스 정보
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업장 이름
              </label>
              <input
                type="text"
                placeholder="Sarah's Pet Grooming"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업 유형
              </label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>미용 살롱</option>
                <option>훈련 센터</option>
                <option>펫 시터</option>
                <option>복합 서비스</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                placeholder="02-1234-5678"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                placeholder="sarah@petgrooming.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주소
            </label>
            <input
              type="text"
              placeholder="서울시 강남구 테헤란로 123"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              운영 시간
            </label>
            <input
              type="text"
              placeholder="화-토: 09:00-18:00, 일월 휴무"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              로고
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                로고 업로드
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              소개
            </label>
            <textarea
              rows={4}
              placeholder="사업장 소개를 입력하세요..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity">
              저장
            </button>
          </div>
        </div>
      </div>

      {/* Operating hours - Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6 text-purple-600" />
          운영 시간
        </h2>
        <p className="text-gray-500">운영 시간 설정이 여기 표시됩니다...</p>
      </div>

      {/* Notification settings - Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="h-6 w-6 text-purple-600" />
          알림 설정
        </h2>
        <p className="text-gray-500">알림 설정이 여기 표시됩니다...</p>
      </div>
    </div>
  )
}
