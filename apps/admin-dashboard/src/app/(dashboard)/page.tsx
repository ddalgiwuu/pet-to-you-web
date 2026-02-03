"use client"

import { motion } from "framer-motion"
import { Users, Building2, DollarSign, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@pet-to-you/ui"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const stats = [
  {
    name: "월간 활성 사용자",
    value: "24,389",
    change: 12.5,
    icon: Users,
  },
  {
    name: "등록 병원",
    value: "1,234",
    change: 8.2,
    icon: Building2,
  },
  {
    name: "월 거래액",
    value: "₩2.4B",
    change: 15.3,
    icon: DollarSign,
  },
  {
    name: "성장률",
    value: "23.4%",
    change: 4.1,
    icon: TrendingUp,
  },
]

const revenueData = [
  { name: "1월", value: 180 },
  { name: "2월", value: 220 },
  { name: "3월", value: 190 },
  { name: "4월", value: 280 },
  { name: "5월", value: 320 },
  { name: "6월", value: 290 },
]

const userGrowth = [
  { name: "1월", users: 12000 },
  { name: "2월", users: 15000 },
  { name: "3월", users: 18000 },
  { name: "4월", users: 21000 },
  { name: "5월", users: 24000 },
  { name: "6월", users: 24389 },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">플랫폼 개요</h1>
        <p className="text-gray-500 mt-1">전체 플랫폼 현황을 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.change >= 0

          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card hover className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl" />

                <CardContent className="pt-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">{stat.name}</span>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <motion.p
                      className="text-3xl font-bold text-gray-900"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    >
                      {stat.value}
                    </motion.p>

                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="text-sm text-gray-500">vs 지난달</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>월별 거래액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>사용자 성장</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
