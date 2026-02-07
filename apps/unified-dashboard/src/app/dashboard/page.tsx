'use client'

import { useUserStore } from '@/lib/store'
import { useDashboardData } from '@/hooks/useDashboardData'
import { TrendingUp, TrendingDown, Calendar, DollarSign, Users, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useUserStore()
  const { data: stats, isLoading } = useDashboardData(user?.role!)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  // Mock data for demo
  const mockStats = {
    totalRevenue: 125400,
    totalBookings: 342,
    activeCustomers: 156,
    completionRate: 94,
    revenueChange: 12.5,
    bookingsChange: 8.3,
    customersChange: 15.2,
    rateChange: 2.1,
  }

  const displayStats = stats || mockStats

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${displayStats.totalRevenue.toLocaleString()}`,
      change: displayStats.revenueChange,
      icon: DollarSign,
      color: 'from-green-400 to-emerald-500',
    },
    {
      title: 'Total Bookings',
      value: displayStats.totalBookings.toString(),
      change: displayStats.bookingsChange,
      icon: Calendar,
      color: 'from-blue-400 to-cyan-500',
    },
    {
      title: 'Active Customers',
      value: displayStats.activeCustomers.toString(),
      change: displayStats.customersChange,
      icon: Users,
      color: 'from-purple-400 to-pink-500',
    },
    {
      title: 'Completion Rate',
      value: `${displayStats.completionRate}%`,
      change: displayStats.rateChange,
      icon: CheckCircle,
      color: 'from-orange-400 to-red-500',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass-card rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className="glass-card rounded-xl p-6 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                {stat.change > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">
                      +{stat.change}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500 font-medium">
                      {stat.change}%
                    </span>
                  </>
                )}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">New booking confirmed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {['New Booking', 'Add Customer', 'View Reports', 'Settings'].map((action) => (
              <button
                key={action}
                className="p-4 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-shadow"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
