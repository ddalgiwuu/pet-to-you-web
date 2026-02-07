/**
 * SpinnerLoader Component
 *
 * Modern loading spinner with animations
 * - Smooth rotation
 * - Multiple variants
 * - Glassmorphism styling
 */

'use client';

import { motion } from 'framer-motion';
import { rotateVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface SpinnerLoaderProps {
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Spinner variant */
  variant?: 'default' | 'gradient' | 'glass';
  /** Custom className */
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantClasses = {
  default: 'text-[oklch(0.65_0.22_250)]',
  gradient: 'text-[oklch(0.65_0.22_250)]',
  glass: 'text-gray-600 dark:text-gray-400',
};

export const SpinnerLoader = ({
  size = 'md',
  variant = 'gradient',
  className,
}: SpinnerLoaderProps) => {
  return (
    <motion.div
      variants={rotateVariants}
      animate="animate"
      className={cn(sizeClasses[size], variantClasses[variant], className)}
      role="status"
      aria-label="Loading"
    >
      <Loader2 className="w-full h-full" />
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
};

SpinnerLoader.displayName = 'SpinnerLoader';
