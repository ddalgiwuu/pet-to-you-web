"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../Card"
import { cn } from "../../lib/utils"

export interface InfoCardProps {
  title: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function InfoCard({
  title,
  description,
  footer,
  children,
  className,
}: InfoCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">{children}</CardContent>
      {footer && (
        <div className="px-6 pb-6 pt-0">
          {footer}
        </div>
      )}
    </Card>
  )
}
