'use client'

import { useUserStore } from '@/lib/store'
import { getMenuItemsForRole, getRoleName } from '@/lib/menu'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUserStore()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const menuItems = getMenuItemsForRole(user.role)
  const roleName = getRoleName(user.role)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar menuItems={menuItems} user={user} roleName={roleName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} roleName={roleName} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
