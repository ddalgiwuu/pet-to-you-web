'use client'

import { useUserStore } from '@/lib/store'
import { useRevenue } from '@/hooks/useDashboardData'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RevenuePage() {
  const { user } = useUserStore()
  const { data: revenue, isLoading } = useRevenue(user?.role!)

  // Mock data
  const monthlyData = [
    { month: 'Jan', revenue: 12500, bookings: 45 },
    { month: 'Feb', revenue: 15200, bookings: 52 },
    { month: 'Mar', revenue: 14800, bookings: 48 },
    { month: 'Apr', revenue: 18900, bookings: 61 },
    { month: 'May', revenue: 21300, bookings: 68 },
    { month: 'Jun', revenue: 19800, bookings: 64 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Analytics</h1>
        <p className="text-gray-600">Track your financial performance and trends</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: '$125,400', change: '+12.5%', color: 'from-green-400 to-emerald-500' },
          { label: 'Avg. per Booking', value: '$367', change: '+8.2%', color: 'from-blue-400 to-cyan-500' },
          { label: 'This Month', value: '$21,300', change: '+15.3%', color: 'from-purple-400 to-pink-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500 font-medium">{stat.change}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by Month */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bookings by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="bookings" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Services */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Revenue Services</h2>
        <div className="space-y-4">
          {[
            { name: 'Pet Grooming', revenue: 45200, percentage: 36 },
            { name: 'Vet Checkup', revenue: 38900, percentage: 31 },
            { name: 'Vaccination', revenue: 24100, percentage: 19 },
            { name: 'Surgery', revenue: 17200, percentage: 14 },
          ].map((service) => (
            <div key={service.name} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{service.name}</span>
                  <span className="text-sm font-bold text-gray-900">${service.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
