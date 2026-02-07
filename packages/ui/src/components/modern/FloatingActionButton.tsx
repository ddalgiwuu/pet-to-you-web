/**
 * FloatingActionButton (FAB) Component
 *
 * Material Design-inspired floating action button
 * - Spring entrance animation
 * - Floating animation loop
 * - Glassmorphism styling
 * - Accessible
 */

'use client';

import { motion } from 'framer-motion';
import { springVariants, floatVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

export interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button icon */
  icon: ReactNode;
  /** Button size */
  size?: 'md' | 'lg';
  /** Enable floating animation */
  float?: boolean;
  /** Custom className */
  className?: string;
}

const sizeClasses = {
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
};

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ icon, size = 'lg', float = true, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        variants={springVariants}
        initial="hidden"
        animate={float ? ['visible', 'animate'] : 'visible'}
        className={cn(
          'fixed bottom-8 right-8 z-50',
          'glass-button rounded-full shadow-lg',
          'bg-gradient-to-r from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)]',
          'text-white',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[oklch(0.65_0.22_250)]',
          'transition-transform hover:scale-110 active:scale-95',
          'flex items-center justify-center',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';
