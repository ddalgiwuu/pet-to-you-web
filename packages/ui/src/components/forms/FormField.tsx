"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface FormFieldProps {
  name: string
  label: string
  description?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  name,
  label,
  description,
  required,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
