/**
 * Framer Motion Animation Presets for Pet-to-You Unified Dashboard
 *
 * Animation Timing Guidelines:
 * - 150-250ms: Micro UI changes (buttons, toggles)
 * - 250-400ms: Large context switches (page transitions)
 * - 300-500ms: Intro animations only
 *
 * Performance Best Practices:
 * - Use transform and opacity (hardware-accelerated)
 * - Leverage layout prop for smooth layout animations
 * - Lazy load animations with useInView
 * - Honor prefers-reduced-motion
 */

import { Variants, Transition } from 'framer-motion';

// Common easing functions
export const easing = {
  easeOut: [0.4, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  springBouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
} as const;

// Page transition variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easing.easeOut }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: easing.easeIn }
  },
};

// Card entrance animation
export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easing.easeOut
    }
  },
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Sidebar navigation item
export const navItemVariants: Variants = {
  rest: { scale: 1, x: 0 },
  hover: {
    scale: 1.05,
    x: 4,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 },
};

// Glass card hover effect
export const glassHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: easing.easeOut }
  },
};

// Button hover/tap variants
export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: easing.easeOut }
  },
  tap: { scale: 0.95 },
};

// Loading skeleton pulse
export const pulseVariants: Variants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

// Toast notification slide-in
export const toastVariants: Variants = {
  initial: { opacity: 0, x: 100, scale: 0.8 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: easing.easeOut }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    transition: { duration: 0.2, ease: easing.easeIn }
  },
};

// Modal/Dialog fade and scale
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: easing.easeOut }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2, ease: easing.easeIn }
  },
};

// Slide from left
export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easing.easeOut }
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { duration: 0.2, ease: easing.easeIn }
  },
};

// Slide from right
export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easing.easeOut }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.2, ease: easing.easeIn }
  },
};

// Fade in/out
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

// Spring entrance animation (bouncy)
export const springVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easing.springBouncy
  },
};

// Floating animation (for badges, notifications)
export const floatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Rotate animation (for loading spinners)
export const rotateVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Accessibility: Respect prefers-reduced-motion
 * Use this for reduced motion variants
 */
export const reduceMotion: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Helper function to check if user prefers reduced motion
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation variants based on reduced motion preference
 */
export const getAnimationVariants = (variants: Variants): Variants => {
  return shouldReduceMotion() ? reduceMotion : variants;
};

/**
 * Common transition presets
 */
export const transitions = {
  fast: { duration: 0.15, ease: easing.easeOut },
  medium: { duration: 0.3, ease: easing.easeOut },
  slow: { duration: 0.5, ease: easing.easeOut },
  spring: easing.spring,
  springBouncy: easing.springBouncy,
} as const;
