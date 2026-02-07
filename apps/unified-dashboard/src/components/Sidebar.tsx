'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as LucideIcons from 'lucide-react'
import type { MenuItem, User } from '@/types'

interface SidebarProps {
  menuItems: MenuItem[]
  user: User
  roleName: string
}

export function Sidebar({ menuItems, user, roleName }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 glass border-r border-white/20 flex flex-col">
      {/* Logo & Role */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <LucideIcons.PawPrint className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Pet to You</h1>
            <p className="text-white/70 text-xs">{roleName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Circle
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  isActive
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <img
            src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-white/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{user.name}</p>
            <p className="text-white/60 text-xs truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
