'use client'

import { Users, DollarSign, Calendar, Phone, Mail } from 'lucide-react'

export default function CustomersPage() {
  // Mock data
  const customers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0101', pets: 2, totalBookings: 12, totalSpent: 1250, lastVisit: '2026-02-08', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', pets: 1, totalBookings: 8, totalSpent: 890, lastVisit: '2026-02-07', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103', pets: 3, totalBookings: 15, totalSpent: 1650, lastVisit: '2026-02-05', status: 'vip' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', phone: '555-0104', pets: 1, totalBookings: 5, totalSpent: 450, lastVisit: '2026-01-30', status: 'active' },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      vip: 'bg-purple-100 text-purple-800',
      inactive: 'bg-gray-100 text-gray-800',
    }
    return colors[status as keyof typeof colors] || colors.active
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
            <p className="text-gray-600">Manage customer relationships and data</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: '156', icon: Users, color: 'from-blue-400 to-cyan-500' },
          { label: 'Active This Month', value: '89', icon: Users, color: 'from-green-400 to-emerald-500' },
          { label: 'VIP Customers', value: '23', icon: Users, color: 'from-purple-400 to-pink-500' },
          { label: 'Avg. Lifetime Value', value: '$1,245', icon: DollarSign, color: 'from-yellow-400 to-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Customers Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.pets}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalBookings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${customer.totalSpent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {customer.lastVisit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-purple-600 hover:text-purple-900 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Customers</h2>
          <div className="space-y-4">
            {customers.slice(0, 3).map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.totalBookings} bookings</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">${customer.totalSpent}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Signups</h2>
          <div className="space-y-4">
            {customers.slice(0, 3).map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-medium">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-900 font-medium text-sm">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
