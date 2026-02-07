/**
 * AnimatedToast Component
 *
 * Modern toast notifications with animations
 * - Smooth slide-in animations
 * - Auto-dismiss
 * - Multiple variants
 * - Accessible
 */

'use client';

import { Toaster as Sonner, toast as sonnerToast } from 'sonner';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

export const AnimatedToast = () => {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            'glass-modal p-4 rounded-xl shadow-lg',
            'flex items-start gap-3 min-w-[300px]'
          ),
          title: 'text-sm font-semibold text-gray-900 dark:text-white',
          description: 'text-sm text-gray-600 dark:text-gray-400 mt-1',
          actionButton: 'glass-button text-sm',
          cancelButton: 'glass-button text-sm',
          closeButton: 'glass-button !p-1',
        },
      }}
    />
  );
};

// Toast helper functions
export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    const Icon = icons.success;
    return sonnerToast.custom(
      (t) => (
        <div className="flex items-start gap-3">
          <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colors.success)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ),
      { duration: duration || 4000 }
    );
  },

  error: (title: string, description?: string, duration?: number) => {
    const Icon = icons.error;
    return sonnerToast.custom(
      (t) => (
        <div className="flex items-start gap-3">
          <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colors.error)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ),
      { duration: duration || 6000 }
    );
  },

  info: (title: string, description?: string, duration?: number) => {
    const Icon = icons.info;
    return sonnerToast.custom(
      (t) => (
        <div className="flex items-start gap-3">
          <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colors.info)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ),
      { duration: duration || 4000 }
    );
  },

  warning: (title: string, description?: string, duration?: number) => {
    const Icon = icons.warning;
    return sonnerToast.custom(
      (t) => (
        <div className="flex items-start gap-3">
          <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colors.warning)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ),
      { duration: duration || 5000 }
    );
  },
};

AnimatedToast.displayName = 'AnimatedToast';
