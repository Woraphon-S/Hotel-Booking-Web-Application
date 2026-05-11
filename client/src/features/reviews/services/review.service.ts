import apiClient from '@/services/apiClient';

export const reviewService = {
  getPropertyReviews: async (propertyId: number) => {
    const response = await apiClient.get(`/reviews/property/${propertyId}`);
    return response.data;
  },
  
  createReview: async (data: { bookingId: number; rating: number; comment: string }) => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },
  
  replyToReview: async (reviewId: number, reply: string) => {
    const response = await apiClient.put(`/reviews/${reviewId}/reply`, { reply });
    return response.data;
  },
};
