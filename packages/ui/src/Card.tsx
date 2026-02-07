"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "./lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient, hover, children, ...props }, ref) => {
    const cardClass = cn(
      "rounded-xl border bg-white p-6 shadow-sm transition-all",
      gradient && "bg-gradient-to-br from-white to-gray-50",
      hover && "hover:shadow-lg hover:-translate-y-0.5",
      className
    )

    if (hover) {
      // Extract any React DOM event handlers to avoid type conflicts with framer-motion
      const {
        onDrag,
        onDragStart,
        onDragEnd,
        onAnimationStart,
        onAnimationEnd,
        ...motionSafeProps
      } = props as any

      return (
        <motion.div
          ref={ref}
          className={cardClass}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          {...motionSafeProps}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={cardClass} {...props}>
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold text-lg leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
