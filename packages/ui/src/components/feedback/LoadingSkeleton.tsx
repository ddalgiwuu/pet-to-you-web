/**
 * LoadingSkeleton Component
 *
 * Animated loading skeleton with pulse effect
 * - Smooth pulse animation
 * - Multiple variants
 * - Glassmorphism styling
 * - Respects prefers-reduced-motion
 */

'use client';

import { motion } from 'framer-motion';
import { pulseVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';

export interface LoadingSkeletonProps {
  /** Skeleton variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Custom className */
  className?: string;
}

export const LoadingSkeleton = ({
  variant = 'rectangular',
  width,
  height,
  className,
}: LoadingSkeletonProps) => {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl h-48',
  };

  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className={cn(
        'glass-panel',
        variantClasses[variant],
        className
      )}
      style={{
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || (variant === 'text' ? undefined : '100%'),
      }}
      aria-label="Loading..."
      role="status"
    />
  );
};

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Skeleton variants for common use cases
export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <LoadingSkeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <LoadingSkeleton variant="card" className={className} />
);

export const SkeletonAvatar = ({ size = 40, className }: { size?: number; className?: string }) => (
  <LoadingSkeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
  />
);
