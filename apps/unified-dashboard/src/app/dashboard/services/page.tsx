'use client'

import { Briefcase, DollarSign, Clock, TrendingUp } from 'lucide-react'

export default function ServicesPage() {
  // Mock data
  const services = [
    { id: '1', name: 'Pet Grooming', category: 'Grooming', price: 50, duration: 60, bookings: 145, revenue: 7250, active: true },
    { id: '2', name: 'Bath & Brush', category: 'Grooming', price: 35, duration: 45, bookings: 98, revenue: 3430, active: true },
    { id: '3', name: 'Nail Trimming', category: 'Grooming', price: 15, duration: 15, bookings: 234, revenue: 3510, active: true },
    { id: '4', name: 'Full Spa Package', category: 'Premium', price: 120, duration: 120, bookings: 56, revenue: 6720, active: true },
    { id: '5', name: 'Teeth Cleaning', category: 'Health', price: 75, duration: 30, bookings: 67, revenue: 5025, active: false },
  ]

  const categories = ['All', 'Grooming', 'Health', 'Premium']

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Services</h1>
            <p className="text-gray-600">Manage your service offerings and pricing</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
            Add Service
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Services', value: '24', icon: Briefcase, color: 'from-blue-400 to-cyan-500' },
          { label: 'Active Services', value: '18', icon: TrendingUp, color: 'from-green-400 to-emerald-500' },
          { label: 'Total Bookings', value: '600', icon: Clock, color: 'from-purple-400 to-pink-500' },
          { label: 'Total Revenue', value: '$25,935', icon: DollarSign, color: 'from-yellow-400 to-orange-500' },
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

      {/* Category Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${category === 'All'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="glass-card rounded-xl p-6 hover:shadow-lg transition-all animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                  {service.category}
                </span>
              </div>
              <button
                className={`
                  w-12 h-6 rounded-full transition-colors relative
                  ${service.active ? 'bg-green-500' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${service.active ? 'right-0.5' : 'left-0.5'}
                  `}
                />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Price</span>
                </div>
                <span className="font-bold text-gray-900">${service.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-medium text-gray-900">{service.duration} min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">Bookings</span>
                </div>
                <span className="font-medium text-gray-900">{service.bookings}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-bold text-purple-600">${service.revenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm">
                Edit
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                Analytics
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Services */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Most Popular Services</h2>
        <div className="space-y-4">
          {services
            .sort((a, b) => b.bookings - a.bookings)
            .slice(0, 5)
            .map((service, index) => (
              <div key={service.id} className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{service.name}</span>
                    <span className="text-sm font-bold text-gray-900">{service.bookings} bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${(service.bookings / 234) * 100}%` }}
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
