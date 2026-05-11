import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/users.types';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
