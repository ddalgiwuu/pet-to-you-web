import { create } from 'zustand'
import type { User, UserRole } from '@/types'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
  getRole: () => UserRole | null
}

// Mock user for development - DEFINE FIRST
export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'HOSPITAL_ADMIN',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: mockUser, // Initialize with mock user for dev
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  getRole: () => get().user?.role || null,
}))
