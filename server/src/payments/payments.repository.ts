import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(data: any) {
    const res = await this.db.query(
      `INSERT INTO payments (booking_id, amount, payment_method, transaction_id, status, paid_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.bookingId,
        data.amount,
        data.paymentMethod,
        data.transactionId,
        data.status || 'pending',
        data.paidAt,
      ]
    );
    return res.rows[0];
  }

  async findByBookingId(bookingId: number) {
    const res = await this.db.query('SELECT * FROM payments WHERE booking_id = $1', [bookingId]);
    return res.rows[0] || null;
  }

  async updateStatus(id: number, status: string, paidAt?: Date) {
    const res = await this.db.query(
      'UPDATE payments SET status = $1, paid_at = COALESCE($2, paid_at) WHERE id = $3 RETURNING *',
      [status, paidAt, id]
    );
    return res.rows[0];
  }
}
