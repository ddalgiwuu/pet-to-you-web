/**
 * GlassHeader Component
 *
 * Modern header with glassmorphism effect
 * - Sticky positioning
 * - Light backdrop blur
 * - Smooth shadow on scroll
 * - Responsive design
 */

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ReactNode } from 'react';

export interface GlassHeaderProps {
  /** Header left content */
  left?: ReactNode;
  /** Header center content */
  center?: ReactNode;
  /** Header right content */
  right?: ReactNode;
  /** Custom className */
  className?: string;
}

export const GlassHeader = ({ left, center, right, className }: GlassHeaderProps) => {
  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  return (
    <motion.header
      style={{
        boxShadow: useTransform(
          shadowOpacity,
          (value) => `0 4px 24px oklch(0 0 0 / ${value})`
        ),
      }}
      className={cn(
        'glass-header sticky top-0 z-40 w-full',
        'px-4 py-3 md:px-6',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left section */}
        {left && <div className="flex items-center gap-4">{left}</div>}

        {/* Center section */}
        {center && <div className="flex-1 flex items-center justify-center">{center}</div>}

        {/* Right section */}
        {right && <div className="flex items-center gap-4">{right}</div>}
      </div>
    </motion.header>
  );
};

GlassHeader.displayName = 'GlassHeader';
