import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RoomsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findByPropertyId(propertyId: number) {
    const res = await this.db.query('SELECT * FROM rooms WHERE property_id = $1', [propertyId]);
    return res.rows;
  }

  async findById(id: number) {
    const res = await this.db.query('SELECT * FROM rooms WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async create(data: any) {
    const res = await this.db.query(
      `INSERT INTO rooms (property_id, name, description, type, price_per_night, capacity, total_rooms, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.propertyId,
        data.name,
        data.description,
        data.type,
        data.pricePerNight,
        data.capacity,
        data.totalRooms,
        data.imageUrl || null,
      ]
    );
    return res.rows[0];
  }

  async update(id: number, data: any) {
    const fields = [];
    const params = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${this.camelToSnake(key)} = $${index++}`);
        params.push(value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    params.push(id);
    const query = `UPDATE rooms SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const res = await this.db.query(query, params);
    return res.rows[0];
  }

  async delete(id: number) {
    await this.db.query('DELETE FROM rooms WHERE id = $1', [id]);
  }

  private camelToSnake(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
