import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findByPropertyId(propertyId: number) {
    const res = await this.db.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.property_id = $1
       ORDER BY r.created_at DESC`,
      [propertyId]
    );
    return res.rows;
  }

  async create(data: any) {
    return this.db.transaction(async (client) => {
      const res = await client.query(
        `INSERT INTO reviews (user_id, property_id, booking_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.userId, data.propertyId, data.bookingId, data.rating, data.comment]
      );
      
      const review = res.rows[0];

      await client.query(
        `UPDATE properties
         SET rating_avg = (SELECT AVG(rating) FROM reviews WHERE property_id = $1),
             review_count = (SELECT COUNT(*) FROM reviews WHERE property_id = $1)
         WHERE id = $1`,
        [data.propertyId]
      );

      return review;
    });
  }

  async addOwnerReply(id: number, reply: string) {
    const res = await this.db.query(
      'UPDATE reviews SET owner_reply = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [reply, id]
    );
    return res.rows[0];
  }

  async findById(id: number) {
    const res = await this.db.query('SELECT * FROM reviews WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
}
