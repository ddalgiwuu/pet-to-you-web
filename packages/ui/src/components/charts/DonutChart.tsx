"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "../../Card"

export interface DonutChartData {
  name: string
  value: number
  color?: string
}

export interface DonutChartProps {
  data: DonutChartData[]
  title?: string
  centerText?: string
  size?: number
  colors?: string[]
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
]

export function DonutChart({
  data,
  title = "분포",
  centerText,
  size = 200,
  colors = DEFAULT_COLORS,
}: DonutChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: size }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={size * 0.25}
                outerRadius={size * 0.35}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          {centerText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-gray-900">{centerText}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
