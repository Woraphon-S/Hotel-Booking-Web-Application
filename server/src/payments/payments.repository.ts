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
}
