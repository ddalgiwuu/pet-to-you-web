/**
 * GlassSidebar Component
 *
 * Modern sidebar with glassmorphism effect
 * - Heavy backdrop blur
 * - Smooth navigation animations
 * - Active state indicators
 * - Collapsible on mobile
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { navItemVariants, slideFromLeft } from '../../lib/animations';
import { cn } from '../../lib/utils';
import { LucideIcon, Menu, X } from 'lucide-react';
import { useState, ReactNode } from 'react';

export interface GlassSidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string | number;
}

export interface GlassSidebarProps {
  /** Sidebar title */
  title: string;
  /** Title icon */
  titleIcon?: ReactNode;
  /** Navigation items */
  items: GlassSidebarItem[];
  /** Active item href */
  activeHref?: string;
  /** Footer content */
  footer?: ReactNode;
  /** On item click */
  onItemClick?: (href: string) => void;
  /** Custom className */
  className?: string;
}

export const GlassSidebar = ({
  title,
  titleIcon,
  items,
  activeHref,
  footer,
  onItemClick,
  className,
}: GlassSidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleItemClick = (href: string) => {
    onItemClick?.(href);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 glass-button lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileOpen || true) && (
          <motion.aside
            variants={slideFromLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'glass-sidebar w-64 h-screen sticky top-0 p-6 flex flex-col',
              'fixed lg:sticky z-50 lg:z-0',
              !isMobileOpen && 'hidden lg:flex',
              className
            )}
          >
            {/* Title */}
            <div className="mb-8 pt-12 lg:pt-0">
              <h1 className="text-xl font-bold flex items-center gap-2">
                {titleIcon}
                <span className="bg-gradient-to-r from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)] bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1 overflow-y-auto">
              {items.map((item) => {
                const isActive = activeHref === item.href;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.href}
                    variants={navItemVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button
                      onClick={() => handleItemClick(item.href)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-[oklch(0.65_0.22_250)]',
                        isActive
                          ? 'bg-gradient-to-r from-[oklch(0.65_0.22_250)] to-[oklch(0.70_0.18_180)] text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-black/30'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-semibold',
                            isActive
                              ? 'bg-white/20'
                              : 'bg-[oklch(0.65_0.22_250)] text-white'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            {footer && <div className="mt-auto pt-4 border-t border-white/20">{footer}</div>}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

GlassSidebar.displayName = 'GlassSidebar';
