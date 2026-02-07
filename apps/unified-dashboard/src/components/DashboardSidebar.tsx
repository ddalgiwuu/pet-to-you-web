"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings,
  Stethoscope,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  title: string
  href: string
  icon: any
}

interface DashboardSidebarProps {
  role: string
  userName: string
  userEmail: string
  userAvatar?: string
}

const hospitalMenuItems: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Patients", href: "/dashboard/patients", icon: Stethoscope },
  { title: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { title: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { title: "Revenue", href: "/dashboard/revenue", icon: DollarSign },
  { title: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

const businessMenuItems: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", href: "/dashboard/customers", icon: Users },
  { title: "Services", href: "/dashboard/services", icon: Briefcase },
  { title: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { title: "Revenue", href: "/dashboard/revenue", icon: DollarSign },
  { title: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar({ role, userName, userEmail, userAvatar }: DashboardSidebarProps) {
  const pathname = usePathname()
  const menuItems = role.startsWith('HOSPITAL') ? hospitalMenuItems : businessMenuItems
  const roleType = role.startsWith('HOSPITAL') ? 'Hospital' : 'Business'

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo & Role */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">PT</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold">Pet to You</h1>
            <Badge variant="secondary" className="text-xs">
              {roleType}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
