"use client"

import { useUserStore } from "@/lib/store"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { DashboardHeader } from "@/components/DashboardHeader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUserStore()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar
        role={user.role}
        userName={user.name}
        userEmail={user.email}
        userAvatar={user.avatar}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          userName={user.name}
          userEmail={user.email}
          userAvatar={user.avatar}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  )
}
