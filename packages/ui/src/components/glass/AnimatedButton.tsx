/**
 * AnimatedButton Component
 *
 * Modern button with spring physics and hover effects
 * - Framer Motion spring animations
 * - Glassmorphism variant
 * - Multiple style variants
 * - Accessible (WCAG AA)
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonVariants as animationVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Custom className */
  className?: string;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)] text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-gradient-to-r from-[oklch(0.70_0.18_180)] to-[oklch(0.75_0.15_140)] text-white shadow-lg hover:shadow-xl',
  glass: 'glass-button text-gray-900 dark:text-white',
  outline: 'border-2 border-[oklch(0.65_0.22_250)] text-[oklch(0.65_0.22_250)] hover:bg-[oklch(0.65_0.22_250)]/10',
  ghost: 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-base rounded-xl',
  lg: 'px-6 py-3 text-lg rounded-xl',
};

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        variants={animationVariants}
        initial="rest"
        whileHover={!isDisabled ? 'hover' : undefined}
        whileTap={!isDisabled ? 'tap' : undefined}
        disabled={isDisabled}
        className={cn(
          'font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[oklch(0.65_0.22_250)]',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
