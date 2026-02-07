"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Card } from "../../Card"
import { cn } from "../../lib/utils"

export interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  index?: number
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend = change !== undefined ? (change >= 0 ? "up" : "down") : "neutral",
  index = 0,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card hover gradient className={cn("relative overflow-hidden", className)}>
        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">{title}</span>
            {Icon && (
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
            )}
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

            {change !== undefined && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend === "up" && "text-green-600",
                    trend === "down" && "text-red-600",
                    trend === "neutral" && "text-gray-600"
                  )}
                >
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {trend === "neutral" && "→"} {Math.abs(change)}%
                </span>
                <span className="text-sm text-gray-500">지난주 대비</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
