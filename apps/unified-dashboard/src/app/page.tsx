'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore, mockUser } from '@/lib/store'

export default function HomePage() {
  const router = useRouter()
  const { setUser } = useUserStore()

  useEffect(() => {
    // For development: auto-login with mock user
    setUser(mockUser)

    // Redirect to dashboard
    router.push('/dashboard')
  }, [setUser, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="text-white text-xl animate-pulse">Redirecting to dashboard...</div>
    </div>
  )
}
