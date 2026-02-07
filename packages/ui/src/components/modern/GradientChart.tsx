/**
 * GradientChart Component
 *
 * Modern area chart with smooth OKLCH gradients
 * - Perceptually uniform color transitions
 * - Smooth animations
 * - Interactive tooltips
 * - Responsive design
 */

'use client';

import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { fadeVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';

export interface GradientChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface GradientChartProps {
  /** Chart data */
  data: GradientChartData[];
  /** Data key for y-axis */
  dataKey?: string;
  /** Chart height */
  height?: number;
  /** Gradient colors (OKLCH) */
  gradientColors?: {
    start: string;
    end: string;
  };
  /** Show grid */
  showGrid?: boolean;
  /** Show axes */
  showAxes?: boolean;
  /** Custom className */
  className?: string;
}

export const GradientChart = ({
  data,
  dataKey = 'value',
  height = 300,
  gradientColors = {
    start: 'oklch(0.75 0.15 250)',
    end: 'oklch(0.65 0.20 280)',
  },
  showGrid = true,
  showAxes = true,
  className,
}: GradientChartProps) => {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={cn('w-full', className)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientColors.start} stopOpacity={0.8} />
              <stop offset="95%" stopColor={gradientColors.end} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(from white l c h / 0.2)"
              vertical={false}
            />
          )}

          {showAxes && (
            <>
              <XAxis
                dataKey="name"
                stroke="oklch(0.55 0 0)"
                style={{ fontSize: '0.75rem' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.55 0 0)"
                style={{ fontSize: '0.75rem' }}
                tickLine={false}
                axisLine={false}
              />
            </>
          )}

          <Tooltip
            contentStyle={{
              background: 'oklch(from white l c h / 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid oklch(from white l c h / 0.2)',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 32px oklch(0 0 0 / 0.1)',
            }}
            labelStyle={{ color: 'oklch(0.25 0 0)' }}
            itemStyle={{ color: gradientColors.start }}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={gradientColors.start}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

GradientChart.displayName = 'GradientChart';
