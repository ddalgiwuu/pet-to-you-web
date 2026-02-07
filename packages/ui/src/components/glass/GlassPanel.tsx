/**
 * GlassPanel Component
 *
 * Subtle glassmorphism panel for section containers
 * - Less prominent than GlassCard
 * - Perfect for content grouping
 * - Maintains visual hierarchy
 */

'use client';

import { forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Custom className */
  className?: string;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('glass-panel', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
