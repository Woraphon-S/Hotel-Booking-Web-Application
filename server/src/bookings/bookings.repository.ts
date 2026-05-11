import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PoolClient } from 'pg';

@Injectable()
export class BookingsRepository {
  constructor(private readonly db: DatabaseService) {}

  async checkAvailability(
    client: PoolClient,
    roomId: number,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> {
    const res = await client.query(
      `SELECT r.total_rooms - COUNT(b.id) as available_count
       FROM rooms r
       LEFT JOIN bookings b ON r.id = b.room_id 
         AND b.status IN ('pending', 'confirmed')
         AND (b.check_in_date, b.check_out_date) OVERLAPS ($2::date, $3::date)
       WHERE r.id = $1
       GROUP BY r.total_rooms`,
      [roomId, checkIn, checkOut]
    );

    if (res.rows.length === 0) return false;
    return parseInt(res.rows[0].available_count) > 0;
  }

  async create(client: PoolClient, data: any) {
    const res = await client.query(
      `INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, status, special_requests)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.userId,
        data.roomId,
        data.checkInDate,
        data.checkOutDate,
        data.totalPrice,
        data.status || 'pending',
        data.specialRequests,
      ]
    );
    return res.rows[0];
  }

  async findByUserId(userId: number) {
    const res = await this.db.query(
      `SELECT b.*, r.name as room_name, p.name as property_name
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN properties p ON r.property_id = p.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return res.rows;
  }

  async findById(id: number) {
    const res = await this.db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async updateStatus(id: number, status: string) {
    const res = await this.db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return res.rows[0];
  }
}
