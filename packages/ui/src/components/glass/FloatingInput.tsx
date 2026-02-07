/**
 * FloatingInput Component
 *
 * Material Design-inspired floating label input
 * - Smooth label animations
 * - Glassmorphism styling
 * - Form validation support
 * - Accessible (WCAG AA)
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { forwardRef, useState, InputHTMLAttributes, ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface FloatingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Helper text */
  helperText?: string;
  /** Leading icon */
  icon?: ReactNode;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

const sizeClasses = {
  sm: 'h-10 text-sm',
  md: 'h-12 text-base',
  lg: 'h-14 text-lg',
};

const labelSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      icon,
      size = 'md',
      className,
      onFocus,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== '';
    const isFloating = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={cn('relative', className)}>
        <div className="relative">
          {/* Leading icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'w-full glass-panel px-4 pt-6 pb-2 transition-all duration-200',
              'focus:ring-2 focus:ring-[oklch(0.65_0.22_250)] focus:outline-none',
              'text-gray-900 dark:text-white placeholder-transparent',
              error && 'ring-2 ring-red-500',
              success && 'ring-2 ring-green-500',
              icon && 'pl-10',
              sizeClasses[size]
            )}
            {...props}
          />

          {/* Floating label */}
          <motion.label
            initial={false}
            animate={{
              y: isFloating ? 8 : 16,
              scale: isFloating ? 0.85 : 1,
              color: isFocused
                ? 'oklch(0.65 0.22 250)'
                : error
                ? 'oklch(0.65 0.25 25)'
                : 'oklch(0.55 0 0)',
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute left-4 pointer-events-none origin-left',
              icon && 'left-10',
              labelSizes[size]
            )}
          >
            {label}
          </motion.label>

          {/* Status icon */}
          {(error || success) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {error && <AlertCircle className="w-5 h-5 text-red-500" />}
              {success && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>
          )}
        </div>

        {/* Helper/Error/Success text */}
        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'mt-1 text-sm',
                error && 'text-red-500',
                success && 'text-green-500',
                !error && !success && 'text-gray-500 dark:text-gray-400'
              )}
            >
              {error || success || helperText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';
