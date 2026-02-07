"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../Card"
import { Button, ButtonProps } from "../../Button"
import { cn } from "../../lib/utils"

export interface ActionCardAction {
  label: string
  onClick: () => void
  variant?: ButtonProps["variant"]
}

export interface ActionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  action: ActionCardAction
  className?: string
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  action,
  className,
}: ActionCardProps) {
  return (
    <Card hover className={cn("relative overflow-hidden", className)}>
      {Icon && (
        <div className="absolute top-4 right-4 p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      )}

      <CardHeader>
        <CardTitle className={cn(Icon && "pr-16")}>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <Button
          variant={action.variant || "default"}
          onClick={action.onClick}
          className="w-full"
        >
          {action.label}
        </Button>
      </CardContent>
    </Card>
  )
}
