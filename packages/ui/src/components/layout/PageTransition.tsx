/**
 * PageTransition Component
 *
 * Smooth page transitions with animations
 * - Fade and slide animations
 * - Respects prefers-reduced-motion
 * - Optimized performance
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, getAnimationVariants } from '../../lib/animations';
import { ReactNode } from 'react';

export interface PageTransitionProps {
  children: ReactNode;
  /** Unique key for AnimatePresence */
  pageKey: string;
}

export const PageTransition = ({ children, pageKey }: PageTransitionProps) => {
  const variants = getAnimationVariants(pageVariants);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

PageTransition.displayName = 'PageTransition';
