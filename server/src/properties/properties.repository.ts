import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PropertiesRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(filters: any) {
    let query = `
      SELECT p.*, 
             COALESCE(MIN(r.price_per_night), p.min_price, 0) as min_price,
             COALESCE(MAX(r.price_per_night), p.max_price, 0) as max_price,
             (SELECT url FROM property_images WHERE property_id = p.id ORDER BY is_main DESC, created_at ASC LIMIT 1) as main_image,
             (SELECT JSON_AGG(json_build_object('id', id, 'url', url, 'is_main', is_main)) FROM property_images WHERE property_id = p.id) as images
      FROM properties p
      LEFT JOIN rooms r ON p.id = r.property_id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.name) {
      query += ` AND p.name ILIKE $${paramIndex++}`;
      params.push(`%${filters.name}%`);
    }

    if (filters.city) {
      query += ` AND p.city = $${paramIndex++}`;
      params.push(filters.city);
    }

    if (filters.province) {
      query += ` AND p.province = $${paramIndex++}`;
      params.push(filters.province);
    }

    if (filters.owner_id) {
      query += ` AND p.owner_id = $${paramIndex++}`;
      params.push(filters.owner_id);
    }

    query += ' GROUP BY p.id';

    if (filters.min_price || filters.max_price) {
      query += ' HAVING 1=1';
      if (filters.min_price) {
        query += ` AND MIN(r.price_per_night) >= $${paramIndex++}`;
        params.push(filters.min_price);
      }
      if (filters.max_price) {
        query += ` AND MAX(r.price_per_night) <= $${paramIndex++}`;
        params.push(filters.max_price);
      }
    }

    const sortField = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const limit = parseInt(filters.limit) || 10;
    const offset = (parseInt(filters.page) - 1) * limit || 0;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const res = await this.db.query(query, params);
    return res.rows;
  }

  async findById(id: number) {
    const res = await this.db.query('SELECT * FROM properties WHERE id = $1', [id]);
    const property = res.rows[0] || null;
    if (property) {
      property.images = await this.getImages(id);
    }
    return property;
  }

  async getImages(propertyId: number) {
    const res = await this.db.query(
      'SELECT * FROM property_images WHERE property_id = $1 ORDER BY is_main DESC, created_at ASC',
      [propertyId]
    );
    return res.rows;
  }

  async addImages(propertyId: number, urls: string[]) {
    for (const url of urls) {
      const existingImages = await this.getImages(propertyId);
      const isMain = existingImages.length === 0;

      await this.db.query(
        'INSERT INTO property_images (property_id, url, is_main) VALUES ($1, $2, $3)',
        [propertyId, url, isMain]
      );
    }
  }

  async deleteImage(id: number) {
    await this.db.query('DELETE FROM property_images WHERE id = $1', [id]);
  }

  async create(data: any) {
    const res = await this.db.query(
      `INSERT INTO properties (owner_id, name, description, address, city, province, zip_code, latitude, longitude, min_price, max_price, amenities)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        data.ownerId,
        data.name,
        data.description,
        data.address,
        data.city,
        data.province,
        data.zipCode,
        data.latitude || null,
        data.longitude || null,
        data.minPrice || 0,
        data.maxPrice || 0,
        data.amenities || [],
      ]
    );
    const property = res.rows[0];
    
    if (data.images && data.images.length > 0) {
      await this.addImages(property.id, data.images);
      property.images = await this.getImages(property.id);
    }
    
    return property;
  }

  async update(id: number, data: any) {
    const { images, ...rest } = data;
    const fields = [];
    const params = [];
    let index = 1;

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        fields.push(`${this.camelToSnake(key)} = $${index++}`);
        params.push(value);
      }
    }

    let property;
    if (fields.length > 0) {
      params.push(id);
      const query = `UPDATE properties SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
      const res = await this.db.query(query, params);
      property = res.rows[0];
    } else {
      property = await this.findById(id);
    }

    if (images && images.length > 0) {
      await this.addImages(id, images);
    }
    
    property.images = await this.getImages(id);
    return property;
  }

  async delete(id: number) {
    await this.db.query('DELETE FROM properties WHERE id = $1', [id]);
  }

  private camelToSnake(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
