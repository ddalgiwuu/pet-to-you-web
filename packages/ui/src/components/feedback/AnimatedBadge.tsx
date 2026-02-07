/**
 * AnimatedBadge Component
 *
 * Modern badge with subtle animations
 * - Spring entrance animation
 * - Multiple variants
 * - Glassmorphism styling
 * - WCAG AA accessible
 */

'use client';

import { motion } from 'framer-motion';
import { springVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

export interface AnimatedBadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Badge variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'glass';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Enable pulse animation */
  pulse?: boolean;
  /** Custom className */
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  primary: 'bg-gradient-to-r from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)] text-white',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  glass: 'glass-panel text-gray-900 dark:text-white',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const AnimatedBadge = forwardRef<HTMLDivElement, AnimatedBadgeProps>(
  ({ variant = 'default', size = 'md', pulse = false, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={springVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium',
          variantClasses[variant],
          sizeClasses[size],
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedBadge.displayName = 'AnimatedBadge';
