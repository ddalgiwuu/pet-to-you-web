'use client'

import { useUserStore } from '@/lib/store'
import { User, Bell, Lock, CreditCard, Building, Palette } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useUserStore()

  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Update your personal information and preferences',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage email and push notification preferences',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Password, 2FA, and security settings',
      color: 'from-red-400 to-orange-500',
    },
    {
      icon: CreditCard,
      title: 'Billing',
      description: 'Manage payment methods and billing information',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Building,
      title: 'Business Info',
      description: 'Update business details and operating hours',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize theme and display preferences',
      color: 'from-indigo-400 to-purple-500',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                {user?.role.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section, index) => (
          <button
            key={section.title}
            className="glass-card rounded-xl p-6 text-left hover:shadow-lg transition-all animate-slide-up group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <section.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h3>
            <p className="text-sm text-gray-600">{section.description}</p>
          </button>
        ))}
      </div>

      {/* Quick Settings */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Settings</h2>
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', enabled: true },
            { label: 'Push Notifications', enabled: true },
            { label: 'Two-Factor Authentication', enabled: false },
            { label: 'Marketing Emails', enabled: false },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-900">{setting.label}</span>
              <button
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${setting.enabled ? 'bg-purple-500' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${setting.enabled ? 'translate-x-6' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-xl p-6 border-2 border-red-200">
        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-left">
            Deactivate Account
          </button>
          <button className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-left">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
