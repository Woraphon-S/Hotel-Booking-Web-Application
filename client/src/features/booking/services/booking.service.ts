import apiClient from '@/services/apiClient';

export const bookingService = {
  createBooking: async (data: any) => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },
  
  getMyBookings: async () => {
    const response = await apiClient.get('/bookings/my');
    return response.data;
  },

  processPayment: async (bookingId: number, data: any) => {
    const response = await apiClient.post(`/payments/${bookingId}`, data);
    return response.data;
  },
};
