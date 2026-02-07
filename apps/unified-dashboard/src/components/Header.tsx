'use client'

import { Bell, Search } from 'lucide-react'
import type { User } from '@/types'

interface HeaderProps {
  user: User
  roleName: string
}

export function Header({ user, roleName }: HeaderProps) {
  return (
    <header className="glass-card border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{roleName}</p>
            </div>
            <img
              src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-purple-200"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
