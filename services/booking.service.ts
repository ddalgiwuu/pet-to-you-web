import { apiClient } from './api';

export interface ApiAppointment {
  id: string;
  bookingNumber: string;
  type: string;
  status: string;
  startDateTime: string;
  pet: {
    name: string;
    breed: string;
    photoUrl?: string;
  };
  owner: {
    name: string;
    phoneNumber: string;
  };
  notes?: string;
  services?: string[];
}

export interface AppointmentsResponse {
  appointments: ApiAppointment[];
  total: number;
  page: number;
  limit: number;
}

export const bookingService = {
  async getAppointments(params?: { status?: string; page?: number; limit?: number }): Promise<AppointmentsResponse> {
    const { data } = await apiClient.get<{ data: AppointmentsResponse }>('/dashboard/hospital/appointments', { params });
    return data.data;
  },

  async confirmBooking(id: string): Promise<void> {
    await apiClient.patch(`/bookings/${id}/confirm`);
  },

  async rejectBooking(id: string, reason: string): Promise<void> {
    await apiClient.patch(`/bookings/${id}/reject`, { reason });
  },
};
