import apiClient from '@/services/apiClient';

export const searchService = {
  searchProperties: async (filters: any) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    const response = await apiClient.get(`/properties?${params.toString()}`);
    return response.data;
  },
  
  getPropertyDetails: async (id: number) => {
    const [propertyRes, roomsRes] = await Promise.all([
      apiClient.get(`/properties/${id}`),
      apiClient.get(`/rooms/property/${id}`),
    ]);
    
    return {
      ...propertyRes.data,
      rooms: roomsRes.data,
    };
  },
};
