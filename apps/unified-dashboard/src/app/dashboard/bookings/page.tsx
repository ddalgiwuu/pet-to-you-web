'use client'

import { useUserStore } from '@/lib/store'
import { useBookings } from '@/hooks/useDashboardData'
import { Calendar, Clock, DollarSign, User } from 'lucide-react'

export default function BookingsPage() {
  const { user } = useUserStore()
  const { data: bookings, isLoading } = useBookings(user?.role!)

  // Mock data
  const mockBookings = [
    { id: '1', customerName: 'John Doe', petName: 'Max', service: 'Grooming', date: '2026-02-10', time: '10:00 AM', status: 'confirmed', price: 50 },
    { id: '2', customerName: 'Jane Smith', petName: 'Bella', service: 'Vet Checkup', date: '2026-02-10', time: '2:00 PM', status: 'pending', price: 75 },
    { id: '3', customerName: 'Bob Johnson', petName: 'Charlie', service: 'Grooming', date: '2026-02-11', time: '11:00 AM', status: 'completed', price: 45 },
    { id: '4', customerName: 'Alice Brown', petName: 'Lucy', service: 'Vaccination', date: '2026-02-11', time: '3:00 PM', status: 'confirmed', price: 60 },
  ]

  const displayBookings = bookings || mockBookings

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
            <p className="text-gray-600">Manage all appointments and reservations</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
            New Booking
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Today', value: '12', color: 'from-blue-400 to-cyan-500' },
          { label: 'Confirmed', value: '8', color: 'from-green-400 to-emerald-500' },
          { label: 'Pending', value: '3', color: 'from-yellow-400 to-orange-500' },
          { label: 'Revenue', value: '$780', color: 'from-purple-400 to-pink-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayBookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium text-sm">
                        {booking.customerName.charAt(0)}
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">{booking.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.petName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {booking.date}
                      <Clock className="w-4 h-4 text-gray-400 ml-2" />
                      {booking.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${booking.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-purple-600 hover:text-purple-900 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
