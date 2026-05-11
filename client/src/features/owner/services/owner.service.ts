import apiClient from '@/services/apiClient';

export const ownerService = {
  getMyProperties: async (ownerId: number) => {
    const response = await apiClient.get(`/properties?owner_id=${ownerId}`);
    return response.data;
  },
  
  createProperty: async (data: any) => {
    const response = await apiClient.post('/properties', data);
    return response.data;
  },
  
  updateProperty: async (id: number, data: any) => {
    const response = await apiClient.put(`/properties/${id}`, data);
    return response.data;
  },
  
  deleteProperty: async (id: number) => {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  },
  
  getRooms: async (propertyId: number) => {
    const response = await apiClient.get(`/rooms/property/${propertyId}`);
    return response.data;
  },
  
  createRoom: async (data: any) => {
    const response = await apiClient.post('/rooms', data);
    return response.data;
  },
  
  updateRoom: async (id: number, data: any) => {
    const response = await apiClient.put(`/rooms/${id}`, data);
    return response.data;
  },
  
  deleteRoom: async (id: number) => {
    const response = await apiClient.delete(`/rooms/${id}`);
    return response.data;
  },
};
