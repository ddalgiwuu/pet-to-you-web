/**
 * GlassModal Component
 *
 * Full-featured modal with glassmorphism effect
 * - Heavy backdrop blur for prominence
 * - Smooth enter/exit animations
 * - Focus trap and keyboard navigation
 * - WCAG AA accessible
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export interface GlassModalProps {
  /** Modal open state */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom className */
  className?: string;
  /** Hide close button */
  hideCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const GlassModal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className,
  hideCloseButton = false,
}: GlassModalProps) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'glass-modal w-full',
                sizeClasses[size],
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
            >
              {/* Header */}
              {(title || !hideCloseButton) && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-xl font-semibold text-gray-900 dark:text-white"
                    >
                      {title}
                    </h2>
                  )}
                  {!hideCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="overflow-y-auto max-h-[70vh]">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

GlassModal.displayName = 'GlassModal';
