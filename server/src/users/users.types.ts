export type UserRole = 'user' | 'owner' | 'admin';

export interface User {
  id: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  refresh_token?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}
