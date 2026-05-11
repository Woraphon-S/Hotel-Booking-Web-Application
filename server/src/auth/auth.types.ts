import { UserRole } from '../users/users.types';

export class LoginDto {
  email!: string;
  password!: string;
}

export class RegisterDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role?: UserRole;
}
