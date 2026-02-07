/**
 * GlassCard Component
 *
 * Modern glassmorphism card with frosted glass effect
 * - Backdrop blur with transparency
 * - Smooth hover animations
 * - Optional gradient overlay
 * - WCAG AA compliant
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { glassHoverVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { forwardRef, ReactNode } from 'react';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  /** Enable hover animation */
  hoverable?: boolean;
  /** Add gradient overlay */
  gradient?: boolean;
  /** Card variant */
  variant?: 'default' | 'subtle' | 'strong';
  /** Custom className */
  className?: string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, hoverable = true, gradient = false, variant = 'default', className, ...props }, ref) => {
    const variants = {
      default: 'glass-card',
      subtle: 'glass-panel',
      strong: 'glass-modal',
    };

    const Component = hoverable ? motion.div : 'div';

    return (
      <Component
        ref={ref}
        variants={hoverable ? glassHoverVariants : undefined}
        initial="rest"
        whileHover={hoverable ? 'hover' : undefined}
        className={cn(
          variants[variant],
          gradient && 'glass-gradient',
          className
        )}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = 'GlassCard';
