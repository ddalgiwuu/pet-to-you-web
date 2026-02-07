'use client'

import { useUserStore } from '@/lib/store'
import { Heart, Phone, Mail, Calendar } from 'lucide-react'

export default function PatientsPage() {
  const { user } = useUserStore()

  // Mock data
  const patients = [
    { id: '1', name: 'Max', species: 'Dog', breed: 'Golden Retriever', owner: 'John Doe', phone: '555-0101', email: 'john@example.com', lastVisit: '2026-02-05', status: 'healthy' },
    { id: '2', name: 'Bella', species: 'Cat', breed: 'Persian', owner: 'Jane Smith', phone: '555-0102', email: 'jane@example.com', lastVisit: '2026-02-07', status: 'treatment' },
    { id: '3', name: 'Charlie', species: 'Dog', breed: 'Beagle', owner: 'Bob Johnson', phone: '555-0103', email: 'bob@example.com', lastVisit: '2026-02-03', status: 'healthy' },
    { id: '4', name: 'Lucy', species: 'Cat', breed: 'Siamese', owner: 'Alice Brown', phone: '555-0104', email: 'alice@example.com', lastVisit: '2026-02-08', status: 'checkup' },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      treatment: 'bg-yellow-100 text-yellow-800',
      checkup: 'bg-blue-100 text-blue-800',
      critical: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || colors.checkup
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patients</h1>
            <p className="text-gray-600">Manage patient records and medical history</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
            New Patient
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: '248', color: 'from-blue-400 to-cyan-500' },
          { label: 'Active Cases', value: '12', color: 'from-yellow-400 to-orange-500' },
          { label: 'Today\'s Visits', value: '8', color: 'from-green-400 to-emerald-500' },
          { label: 'Critical', value: '2', color: 'from-red-400 to-pink-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="glass-card rounded-xl p-6 hover:shadow-lg transition-all animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.breed}</p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Owner:</span>
                <span className="font-medium text-gray-900">{patient.owner}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Last visit: {patient.lastVisit}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm">
                View Records
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                Schedule Visit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
