/**
 * ModernTable Component
 *
 * Smooth, glassmorphism table with animations
 * - Glass panel styling
 * - Smooth row hover effects
 * - Sticky header support
 * - Responsive design
 */

'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeVariants } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

const ModernTable = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto glass-panel rounded-xl">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
);
ModernTable.displayName = 'ModernTable';

const ModernTableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'sticky top-0 z-10 backdrop-blur-md bg-white/50 dark:bg-black/50',
      className
    )}
    {...props}
  />
));
ModernTableHeader.displayName = 'ModernTableHeader';

const ModernTableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <motion.tbody
    ref={ref}
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
ModernTableBody.displayName = 'ModernTableBody';

const ModernTableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <motion.tr
      ref={ref}
      variants={fadeVariants}
      className={cn(
        'border-b border-white/20 transition-all duration-200',
        'hover:bg-black/5 dark:hover:bg-white/5',
        'data-[state=selected]:bg-black/10 dark:data-[state=selected]:bg-white/10',
        className
      )}
      {...props}
    />
  )
);
ModernTableRow.displayName = 'ModernTableRow';

const ModernTableHead = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-semibold text-gray-700 dark:text-gray-300',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
ModernTableHead.displayName = 'ModernTableHead';

const ModernTableCell = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
ModernTableCell.displayName = 'ModernTableCell';

const ModernTableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-gray-500 dark:text-gray-400', className)}
    {...props}
  />
));
ModernTableCaption.displayName = 'ModernTableCaption';

export {
  ModernTable,
  ModernTableHeader,
  ModernTableBody,
  ModernTableRow,
  ModernTableHead,
  ModernTableCell,
  ModernTableCaption,
};
