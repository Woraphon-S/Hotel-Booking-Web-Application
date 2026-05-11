import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, CreateUserDto } from './users.types';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
    const res = await this.db.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return res.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const res = await this.db.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  }

  async create(user: CreateUserDto): Promise<User> {
    const res = await this.db.query<User>(
      `INSERT INTO users (email, password, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user.email, user.password, user.firstName, user.lastName, user.role || 'user']
    );
    return res.rows[0];
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.db.query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2',
      [refreshToken, userId]
    );
  }
}
