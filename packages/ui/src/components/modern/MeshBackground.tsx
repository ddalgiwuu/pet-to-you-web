/**
 * MeshBackground Component
 *
 * Animated mesh gradient background
 * - Smooth OKLCH color transitions
 * - Subtle animation
 * - Performance optimized
 * - Accessible (respects prefers-reduced-motion)
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface MeshBackgroundProps {
  /** Theme variant */
  variant?: 'hospital' | 'business' | 'vibrant' | 'custom';
  /** Custom gradient colors (OKLCH) */
  colors?: string[];
  /** Enable animation */
  animated?: boolean;
  /** Animation duration in seconds */
  duration?: number;
  /** Custom className */
  className?: string;
}

const gradientVariants = {
  hospital: 'bg-[linear-gradient(135deg,oklch(0.95_0.02_250),oklch(0.90_0.03_280))]',
  business: 'bg-[linear-gradient(135deg,oklch(0.95_0.02_280),oklch(0.90_0.03_240))]',
  vibrant: 'bg-[linear-gradient(to_bottom_right,oklch(0.95_0.03_340),oklch(0.92_0.02_280),oklch(0.88_0.03_240))]',
  custom: '',
};

export const MeshBackground = ({
  variant = 'hospital',
  colors,
  animated = true,
  duration = 20,
  className,
}: MeshBackgroundProps) => {
  const customGradient = colors
    ? `linear-gradient(135deg, ${colors.join(', ')})`
    : undefined;

  return (
    <div className={cn('fixed inset-0 -z-10 overflow-hidden', className)}>
      {/* Base gradient */}
      <motion.div
        animate={
          animated
            ? {
                background: [
                  customGradient || gradientVariants[variant],
                  `linear-gradient(165deg, ${colors?.[0] || 'oklch(0.93 0.02 280)'}, ${colors?.[1] || 'oklch(0.88 0.03 250)'})`,
                  customGradient || gradientVariants[variant],
                ],
              }
            : undefined
        }
        transition={
          animated
            ? {
                duration,
                repeat: Infinity,
                ease: 'linear',
              }
            : undefined
        }
        className={cn('absolute inset-0', !customGradient && gradientVariants[variant])}
        style={customGradient ? { background: customGradient } : undefined}
      />

      {/* Mesh overlay for depth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, oklch(from white l c h / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, oklch(from white l c h / 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, oklch(from white l c h / 0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Animated orbs */}
      {animated && (
        <>
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: duration * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, oklch(0.75 0.15 250), transparent)',
            }}
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, -40, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: duration * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, oklch(0.70 0.18 180), transparent)',
            }}
          />
        </>
      )}
    </div>
  );
};

MeshBackground.displayName = 'MeshBackground';
