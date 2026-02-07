"use client"

import { Bell, Search, User } from "lucide-react"
import { motion } from "framer-motion"

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <motion.button
          className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-pink-500 rounded-full" />
        </motion.button>

        {/* Profile */}
        <motion.button
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Sarah</p>
            <p className="text-xs text-gray-500">펫 미용사</p>
          </div>
        </motion.button>
      </div>
    </header>
  )
}
