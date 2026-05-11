import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { BookingsService } from '../bookings/bookings.service';
import { PropertiesService } from '../properties/properties.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly bookingsService: BookingsService,
    private readonly propertiesService: PropertiesService,
    private readonly db: DatabaseService,
  ) {}

  async findByProperty(propertyId: number) {
    return this.reviewsRepository.findByPropertyId(propertyId);
  }

  async create(userId: number, data: any) {
    const { bookingId, rating, comment } = data;

    const booking = await this.bookingsService.getBooking(bookingId);
    if (booking.user_id !== userId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    if (booking.status !== 'confirmed' && booking.status !== 'completed') {
      throw new BadRequestException('You can only review confirmed or completed bookings');
    }

    const propertyId = await this.getRoomPropertyId(booking.room_id);

    return this.reviewsRepository.create({
      userId,
      propertyId,
      bookingId,
      rating,
      comment,
    });
  }

  async addReply(userId: number, reviewId: number, reply: string) {
    const review = await this.reviewsRepository.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    const property = await this.propertiesService.findOne(review.property_id);
    if (property.owner_id !== userId) {
      throw new ForbiddenException('Only the property owner can reply to this review');
    }

    return this.reviewsRepository.addOwnerReply(reviewId, reply);
  }

  private async getRoomPropertyId(roomId: number): Promise<number> {
    const res = await this.db.query('SELECT property_id FROM rooms WHERE id = $1', [roomId]);
    if (res.rows.length === 0) throw new NotFoundException('Room not found');
    return res.rows[0].property_id;
  }
}
