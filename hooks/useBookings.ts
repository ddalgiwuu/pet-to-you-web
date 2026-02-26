import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import type { ApiAppointment } from '../services/booking.service';
import type { Reservation } from '../types';

type ServiceType = 'hospital' | 'grooming' | 'hotel';

const BOOKING_TYPE_LABELS: Record<string, string> = {
  consultation: '일반 진료',
  vaccination: '예방접종',
  surgery: '수술',
  grooming: '미용',
  daycare: '유치원',
  hotel: '호텔 (숙박)',
  emergency: '응급진료',
  checkup: '건강검진',
};

const BOOKING_TYPE_TO_SERVICE: Record<string, ServiceType> = {
  consultation: 'hospital',
  vaccination: 'hospital',
  surgery: 'hospital',
  emergency: 'hospital',
  checkup: 'hospital',
  grooming: 'grooming',
  hotel: 'hotel',
  daycare: 'hotel',
};

function transformAppointment(booking: ApiAppointment): Reservation {
  const dt = new Date(booking.startDateTime);
  return {
    id: booking.id,
    patientName: booking.pet.name,
    breed: booking.pet.breed,
    ownerName: booking.owner.name,
    phoneNumber: booking.owner.phoneNumber,
    date: dt.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    time: dt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
    requestType: BOOKING_TYPE_LABELS[booking.type] || booking.type,
    serviceType: BOOKING_TYPE_TO_SERVICE[booking.type] || 'hospital',
    status: booking.status as Reservation['status'],
    source: 'app' as const,
    avatarUrl:
      booking.pet.photoUrl ||
      `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(booking.pet.name)}`,
    symptoms: booking.notes || '',
  };
}

export function useBookings() {
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await bookingService.getAppointments();
      return response.appointments.map(transformAppointment);
    },
    refetchInterval: 30_000,
    staleTime: 20_000,
    retry: 2,
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => bookingService.confirmBooking(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingService.rejectBooking(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  return {
    appointments,
    isLoading,
    isError,
    confirmBooking: confirmMutation,
    rejectBooking: rejectMutation,
  };
}
