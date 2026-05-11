import apiClient from '@/services/apiClient';
import { LoginDto, RegisterDto, AuthResponse } from '../types';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  
  logout: async (userId: number): Promise<void> => {
    await apiClient.post('/auth/logout', { userId });
  },
};
