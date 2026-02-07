/**
 * AnimatedProgress Component
 *
 * Modern progress indicator with animations
 * - Smooth progress animation
 * - Glassmorphism styling
 * - Multiple variants
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface AnimatedProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Progress variant */
  variant?: 'default' | 'gradient' | 'glass';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Show label */
  showLabel?: boolean;
  /** Custom className */
  className?: string;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export const AnimatedProgress = ({
  value,
  variant = 'gradient',
  size = 'md',
  showLabel = false,
  className,
}: AnimatedProgressProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const barClasses = {
    default: 'bg-[oklch(0.65_0.22_250)]',
    gradient: 'bg-gradient-to-r from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)]',
    glass: 'glass',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full glass-panel overflow-hidden', sizeClasses[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full', barClasses[variant])}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right"
        >
          {clampedValue}%
        </motion.p>
      )}
    </div>
  );
};

AnimatedProgress.displayName = 'AnimatedProgress';
