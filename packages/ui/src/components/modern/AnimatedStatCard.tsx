/**
 * AnimatedStatCard Component
 *
 * Modern stat card with glassmorphism and animations
 * - Counter animation
 * - Trend indicators
 * - Smooth hover effects
 * - Gradient accents
 */

'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cardVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect } from 'react';

export interface AnimatedStatCardProps {
  /** Stat icon */
  icon: LucideIcon;
  /** Stat title */
  title: string;
  /** Stat value */
  value: number;
  /** Previous value for comparison */
  previousValue?: number;
  /** Value formatter */
  formatter?: (value: number) => string;
  /** Trend percentage */
  trend?: number;
  /** Trend direction */
  trendDirection?: 'up' | 'down' | 'neutral';
  /** Icon gradient colors */
  iconGradient?: {
    from: string;
    to: string;
  };
  /** Custom className */
  className?: string;
}

const defaultIconGradient = {
  from: 'oklch(0.65 0.22 250)',
  to: 'oklch(0.70 0.18 180)',
};

export const AnimatedStatCard = ({
  icon: Icon,
  title,
  value,
  previousValue,
  formatter = (v) => v.toLocaleString(),
  trend,
  trendDirection,
  iconGradient = defaultIconGradient,
  className,
}: AnimatedStatCardProps) => {
  const count = useMotionValue(previousValue || 0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: 'easeOut',
    });

    return controls.stop;
  }, [count, value]);

  // Auto-calculate trend if not provided
  const calculatedTrend =
    trend !== undefined
      ? trend
      : previousValue
      ? ((value - previousValue) / previousValue) * 100
      : 0;

  const calculatedDirection =
    trendDirection ||
    (calculatedTrend > 0 ? 'up' : calculatedTrend < 0 ? 'down' : 'neutral');

  const trendColor = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  }[calculatedDirection];

  const TrendIcon = calculatedDirection === 'up' ? TrendingUp : TrendingDown;

  return (
    <motion.div variants={cardVariants} className={cn('glass-card glass-gradient', className)}>
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className="p-3 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${iconGradient.from}, ${iconGradient.to})`,
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Trend */}
        {calculatedDirection !== 'neutral' && calculatedTrend !== 0 && (
          <div className={cn('flex items-center gap-1 text-sm font-semibold', trendColor)}>
            <TrendIcon className="w-4 h-4" />
            <span>{Math.abs(calculatedTrend).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <motion.p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
          {formatter(rounded.get())}
        </motion.p>
      </div>

      {/* Comparison text */}
      {previousValue !== undefined && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          vs {formatter(previousValue)} last period
        </p>
      )}
    </motion.div>
  );
};

AnimatedStatCard.displayName = 'AnimatedStatCard';
