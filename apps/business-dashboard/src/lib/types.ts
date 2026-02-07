// Business Dashboard Type Definitions
// Based on BUSINESS_DASHBOARD_DESIGN.md

export interface Business {
  id: string
  name: string
  type: 'grooming' | 'training' | 'sitting' | 'walking' | 'multi_service'
  phone: string
  email: string
  address: string
  businessHours: BusinessHours
  logo?: string
  description?: string
}

export interface BusinessHours {
  monday: TimeSlot | null
  tuesday: TimeSlot | null
  wednesday: TimeSlot | null
  thursday: TimeSlot | null
  friday: TimeSlot | null
  saturday: TimeSlot | null
  sunday: TimeSlot | null
  breakTime?: TimeSlot
  bookingInterval: number // minutes
  maxBookingsPerSlot: number
}

export interface TimeSlot {
  start: string // HH:mm format
  end: string   // HH:mm format
}

export interface Service {
  id: string
  name: string
  category: 'grooming' | 'training' | 'sitting' | 'walking' | 'other'
  duration: number // minutes
  price: number
  description: string
  popularity: number // 1-5 stars
  bookingsThisMonth: number
  revenueThisMonth: number
  isActive: boolean
  photos?: string[]
  requirements?: string[] // e.g., ["Small dogs only", "Must be vaccinated"]
}

export interface ServicePackage {
  id: string
  name: string
  services: { serviceId: string; quantity: number }[]
  price: number
  discount: number
  validityDays?: number // e.g., 90 days
  description: string
}

export interface Booking {
  id: string
  serviceId: string
  serviceName: string
  customerId: string
  customerName: string
  customerPhone: string
  petId: string
  petName: string
  petBreed: string
  date: string
  startTime: string
  endTime: string
  duration: number
  price: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  specialInstructions?: string
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  assignedTo?: string // employee ID
  photos?: string[] // before/after photos
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address?: string
  joinedDate: string
  totalVisits: number
  totalSpent: number
  lastVisit: string
  status: 'new' | 'regular' | 'vip' | 'dormant'
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  notificationPreferences: {
    sms: boolean
    email: boolean
    promotions: boolean
  }
  notes?: string
}

export interface Pet {
  id: string
  customerId: string
  name: string
  type: 'dog' | 'cat' | 'bird' | 'other'
  breed: string
  age: number
  weight: number
  gender: 'male' | 'female'
  microchipId?: string
  vaccinations: Vaccination[]
  specialNeeds?: string
  medicalHistory?: string
  behaviorNotes?: string
  photos?: string[]
}

export interface Vaccination {
  name: string
  date: string
  nextDue?: string
}

export interface Review {
  id: string
  customerId: string
  customerName: string
  bookingId: string
  serviceName: string
  petName: string
  rating: number // 1-5
  comment: string
  photos?: string[]
  date: string
  reply?: {
    text: string
    date: string
    author: string
  }
  isPublic: boolean
  helpful?: number // likes count
}

export interface RevenueData {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate: string
  endDate: string
  totalRevenue: number
  totalBookings: number
  averagePayment: number
  growthRate: number
  revenueByService: {
    serviceId: string
    serviceName: string
    bookings: number
    revenue: number
  }[]
  revenueByDay: {
    day: string
    revenue: number
    bookings: number
  }[]
  paymentMethods: {
    method: 'card' | 'cash' | 'transfer'
    percentage: number
    amount: number
  }[]
}

export interface CustomerAnalytics {
  newCustomers: number
  repeatCustomers: number
  dormantCustomers: number
  averageVisitsPerCustomer: number
  retentionRate: number
  customerLifetimeValue: number
}

export interface DashboardStats {
  todayRevenue: number
  revenueChange: number
  todayBookings: number
  bookingsChange: number
  totalCustomers: number
  customersChange: number
  averageRating: number
  ratingChange: number
}

export interface TodayBooking {
  id: string
  time: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  serviceName: string
  petName: string
  petBreed: string
  duration: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Form Input Types
export interface CreateBookingInput {
  customerId: string
  petId: string
  serviceId: string
  date: string
  startTime: string
  notes?: string
  specialInstructions?: string
}

export interface UpdateBookingInput {
  status?: Booking['status']
  notes?: string
  photos?: string[]
  paymentStatus?: Booking['paymentStatus']
}

export interface CreateServiceInput {
  name: string
  category: Service['category']
  duration: number
  price: number
  description: string
  requirements?: string[]
  photos?: string[]
}

export interface CreateCustomerInput {
  name: string
  phone: string
  email: string
  address?: string
  notificationPreferences?: Customer['notificationPreferences']
}

export interface CreatePetInput {
  customerId: string
  name: string
  type: Pet['type']
  breed: string
  age: number
  weight: number
  gender: Pet['gender']
  microchipId?: string
  specialNeeds?: string
  behaviorNotes?: string
}

export interface CreateReviewReplyInput {
  reviewId: string
  text: string
}
