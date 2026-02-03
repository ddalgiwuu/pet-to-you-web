import { Stats, Booking, Patient, Review, Revenue } from './types'

export const mockStats: Stats = {
  totalRevenue: 12450000,
  revenueChange: 12.5,
  totalBookings: 48,
  bookingsChange: 8.2,
  totalPatients: 234,
  patientsChange: 15.3,
  averageRating: 4.8,
  ratingChange: 0.2,
}

export const mockBookings: Booking[] = [
  {
    id: '1',
    patientName: '김민수',
    petName: '초코',
    petType: '강아지',
    service: '건강검진',
    date: '2024-01-17',
    time: '10:00',
    status: 'confirmed',
    amount: 150000,
  },
  {
    id: '2',
    patientName: '이지은',
    petName: '나비',
    petType: '고양이',
    service: '예방접종',
    date: '2024-01-17',
    time: '11:30',
    status: 'pending',
    amount: 80000,
  },
  {
    id: '3',
    patientName: '박철수',
    petName: '뽀삐',
    petType: '강아지',
    service: '치과치료',
    date: '2024-01-17',
    time: '14:00',
    status: 'confirmed',
    amount: 200000,
  },
  {
    id: '4',
    patientName: '최영희',
    petName: '구름',
    petType: '고양이',
    service: '중성화수술',
    date: '2024-01-17',
    time: '15:30',
    status: 'completed',
    amount: 350000,
  },
]

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: '김민수',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    pets: [
      {
        id: '1',
        name: '초코',
        type: '강아지',
        breed: '푸들',
        age: 3,
        weight: 5.2,
      },
    ],
    lastVisit: '2024-01-15',
    totalVisits: 12,
  },
  {
    id: '2',
    name: '이지은',
    phone: '010-2345-6789',
    email: 'lee@example.com',
    pets: [
      {
        id: '2',
        name: '나비',
        type: '고양이',
        breed: '코리안숏헤어',
        age: 2,
        weight: 3.8,
      },
    ],
    lastVisit: '2024-01-10',
    totalVisits: 8,
  },
]

export const mockReviews: Review[] = [
  {
    id: '1',
    patientName: '김민수',
    petName: '초코',
    rating: 5,
    comment: '정말 친절하고 꼼꼼하게 진료해주셨어요. 초코가 무서워하지 않도록 배려해주셔서 감사합니다.',
    date: '2024-01-15',
    reply: '소중한 초코를 믿고 맡겨주셔서 감사합니다.',
  },
  {
    id: '2',
    patientName: '이지은',
    petName: '나비',
    rating: 4,
    comment: '시설도 깨끗하고 대기시간도 짧아서 좋았습니다.',
    date: '2024-01-10',
  },
]

export const mockRevenue: Revenue[] = [
  { date: '1월 11일', amount: 1200000, bookings: 8 },
  { date: '1월 12일', amount: 1500000, bookings: 10 },
  { date: '1월 13일', amount: 900000, bookings: 6 },
  { date: '1월 14일', amount: 1800000, bookings: 12 },
  { date: '1월 15일', amount: 2100000, bookings: 14 },
  { date: '1월 16일', amount: 1600000, bookings: 11 },
  { date: '1월 17일', amount: 1400000, bookings: 9 },
]
