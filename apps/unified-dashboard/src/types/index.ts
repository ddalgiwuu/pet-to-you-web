export type UserRole =
  | 'HOSPITAL_ADMIN'
  | 'HOSPITAL_STAFF'
  | 'HOSPITAL_VET'
  | 'BUSINESS_ADMIN'
  | 'BUSINESS_STAFF'
  | 'BUSINESS_GROOMER'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface DashboardStats {
  totalRevenue: number
  totalBookings: number
  activeCustomers: number
  completionRate: number
  revenueChange: number
  bookingsChange: number
  customersChange: number
  rateChange: number
}

export interface MenuItem {
  label: string
  href: string
  icon: string
  roles: UserRole[]
}

export interface Booking {
  id: string
  customerName: string
  petName: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  price: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  pets: Pet[]
  totalBookings: number
  totalSpent: number
  lastVisit: string
}

export interface Pet {
  id: string
  name: string
  species: string
  breed: string
  age: number
  weight: number
}

export interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  isActive: boolean
}

export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  service: string
  response?: string
}

export interface RevenueData {
  month: string
  revenue: number
  bookings: number
  avgPrice: number
}
