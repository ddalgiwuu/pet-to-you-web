"use client"

import * as React from "react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "../../Card"

export interface StatsChartProps {
  data: { name: string; value: number }[]
  title?: string
  type?: "bar" | "line"
  height?: number
  color?: string
  showGrid?: boolean
}

export function StatsChart({
  data,
  title = "통계",
  type = "bar",
  height = 200,
  color = "#3b82f6",
  showGrid = true,
}: StatsChartProps) {
  const ChartComponent = type === "bar" ? BarChart : LineChart

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              {type === "bar" ? (
                <Bar
                  dataKey="value"
                  fill={color}
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, r: 4 }}
                  animationDuration={1000}
                />
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
