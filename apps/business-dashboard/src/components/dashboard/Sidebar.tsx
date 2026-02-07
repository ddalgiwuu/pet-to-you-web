"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Scissors,
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@pet-to-you/ui"

const navigation = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "서비스 관리", href: "/services", icon: Scissors },
  { name: "예약/일정", href: "/bookings", icon: Calendar },
  { name: "고객 관리", href: "/customers", icon: Users },
  { name: "리뷰 관리", href: "/reviews", icon: MessageSquare },
  { name: "매출 분석", href: "/revenue", icon: TrendingUp },
  { name: "설정", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Pet to You
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-r"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors">
          <LogOut className="h-5 w-5" />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  )
}
