"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Card } from "@pet-to-you/ui"

interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  index: number
}

export function StatsCard({ title, value, change, icon: Icon, index }: StatsCardProps) {
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card hover gradient className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">{title}</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="space-y-2">
            <motion.p
              className="text-3xl font-bold text-gray-900"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              {value}
            </motion.p>

            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "↑" : "↓"} {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500">지난주 대비</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
