export interface Hospital {
  id: string
  name: string
  address: string
  phone: string
  email: string
  rating: number
  reviewCount: number
}

export interface Booking {
  id: string
  patientName: string
  petName: string
  petType: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number
}

export interface Patient {
  id: string
  name: string
  phone: string
  email: string
  pets: Pet[]
  lastVisit: string
  totalVisits: number
}

export interface Pet {
  id: string
  name: string
  type: string
  breed: string
  age: number
  weight: number
}

export interface Review {
  id: string
  patientName: string
  petName: string
  rating: number
  comment: string
  date: string
  reply?: string
}

export interface Revenue {
  date: string
  amount: number
  bookings: number
}

export interface Stats {
  totalRevenue: number
  revenueChange: number
  totalBookings: number
  bookingsChange: number
  totalPatients: number
  patientsChange: number
  averageRating: number
  ratingChange: number
}
