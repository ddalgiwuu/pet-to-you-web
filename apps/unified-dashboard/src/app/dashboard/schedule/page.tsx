'use client'

import { Calendar, Clock, User, MapPin } from 'lucide-react'

export default function SchedulePage() {
  // Mock data
  const schedule = [
    { id: '1', time: '09:00 AM', patient: 'Max', owner: 'John Doe', type: 'Checkup', duration: '30 min', location: 'Room 1' },
    { id: '2', time: '10:00 AM', patient: 'Bella', owner: 'Jane Smith', type: 'Surgery', duration: '2 hours', location: 'Operating Room' },
    { id: '3', time: '12:30 PM', patient: 'Charlie', owner: 'Bob Johnson', type: 'Vaccination', duration: '15 min', location: 'Room 2' },
    { id: '4', time: '02:00 PM', patient: 'Lucy', owner: 'Alice Brown', type: 'Grooming', duration: '1 hour', location: 'Grooming Area' },
    { id: '5', time: '03:30 PM', patient: 'Rocky', owner: 'Tom Wilson', type: 'Checkup', duration: '30 min', location: 'Room 1' },
  ]

  const getTypeColor = (type: string) => {
    const colors = {
      Checkup: 'bg-blue-100 text-blue-800',
      Surgery: 'bg-red-100 text-red-800',
      Vaccination: 'bg-green-100 text-green-800',
      Grooming: 'bg-purple-100 text-purple-800',
    }
    return colors[type as keyof typeof colors] || colors.Checkup
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule</h1>
            <p className="text-gray-600">Today's appointments and upcoming visits</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mini Calendar */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">February 2026</h2>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1
              const isToday = day === 8
              return (
                <button
                  key={day}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all
                    ${isToday
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Today's Stats */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Appointments', value: '8', color: 'from-blue-400 to-cyan-500' },
              { label: 'Completed', value: '3', color: 'from-green-400 to-emerald-500' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {['View Week', 'View Month', 'Export Schedule', 'Print'].map((action) => (
                <button
                  key={action}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {schedule.map((appointment, index) => (
            <div
              key={appointment.id}
              className="p-6 hover:bg-gray-50 transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Time */}
                  <div className="flex items-center gap-2 w-32">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{appointment.time}</span>
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium">
                        {appointment.patient.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="w-4 h-4" />
                          <span>{appointment.owner}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full font-medium ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                      <span className="text-gray-600">Duration: {appointment.duration}</span>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm">
                    Start
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
