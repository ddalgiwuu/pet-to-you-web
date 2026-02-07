"use client"

/**
 * Settings Page
 * Hospital settings and configuration
 */

import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from "@pet-to-you/ui"
import { Building2, Clock, MapPin, Phone, Mail, Globe, Bell, Lock, Users } from "lucide-react"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const hospital = session?.user?.hospital

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-500 mt-1">병원 정보 및 시스템 설정을 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Hospital Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  병원 기본 정보
                </CardTitle>
                <Button variant="outline" size="sm">수정</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">병원 이름</label>
                <Input
                  value={hospital?.name || "서울동물병원"}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">사업자 등록번호</label>
                <Input
                  value="123-45-67890"
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">대표자명</label>
                <Input
                  value="홍길동"
                  disabled
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                연락처 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  전화번호
                </label>
                <Input
                  value="02-1234-5678"
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  이메일
                </label>
                <Input
                  value={hospital?.email || "admin@hospital.com"}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  웹사이트
                </label>
                <Input
                  value="https://www.hospital.com"
                  disabled
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                주소 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">주소</label>
                <Input
                  value="서울특별시 강남구 테헤란로 123"
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">상세주소</label>
                <Input
                  value="메디컬빌딩 2층"
                  disabled
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                운영 시간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { day: '월-금', hours: '09:00 - 18:00' },
                  { day: '토요일', hours: '09:00 - 14:00' },
                  { day: '일요일', hours: '휴무' },
                  { day: '공휴일', hours: '휴무' },
                ].map((schedule) => (
                  <div key={schedule.day} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="font-medium text-gray-700">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Settings */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                계정 상태
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">계정 등급</span>
                <Badge variant="success">프리미엄</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">상태</span>
                <Badge variant="default">활성</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">가입일</span>
                <span className="text-sm text-gray-900">2024.01.01</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                구독 관리
              </Button>
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                팀 멤버
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">관리자</span>
                <span className="text-sm font-medium text-gray-900">2명</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">수의사</span>
                <span className="text-sm font-medium text-gray-900">5명</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">스태프</span>
                <span className="text-sm font-medium text-gray-900">3명</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                팀원 관리
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">예약 알림</span>
                <Badge variant="success">ON</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">리뷰 알림</span>
                <Badge variant="success">ON</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">결제 알림</span>
                <Badge variant="success">ON</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                알림 관리
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 작업</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                비밀번호 변경
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                보안 설정
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-red-600">
                로그아웃
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
