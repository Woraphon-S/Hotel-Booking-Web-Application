import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { DatabaseService } from '../database/database.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly db: DatabaseService,
    private readonly roomsService: RoomsService,
  ) {}

  async createBooking(userId: number, data: any) {
    const { roomId, checkInDate, checkOutDate } = data;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    return this.db.transaction(async (client) => {
      const roomLock = await client.query('SELECT id FROM rooms WHERE id = $1 FOR UPDATE', [roomId]);
      if (roomLock.rows.length === 0) {
        throw new NotFoundException('Room not found');
      }

      const isAvailable = await this.bookingsRepository.checkAvailability(
        client,
        roomId,
        checkInDate,
        checkOutDate
      );

      if (!isAvailable) {
        throw new BadRequestException('Room is not available for the selected dates');
      }

      const room = await this.roomsService.findOne(roomId);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * Number(room.price_per_night);

      const booking = await this.bookingsRepository.create(client, {
        userId,
        roomId,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: 'pending',
        specialRequests: data.specialRequests,
      });

      return booking;
    });
  }

  async getUserBookings(userId: number) {
    return this.bookingsRepository.findByUserId(userId);
  }

  async getBooking(id: number) {
    const booking = await this.bookingsRepository.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async getBookingForUser(id: number, userId: number) {
    const booking = await this.getBooking(id);
    if (booking.user_id !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงการจองนี้');
    }
    return booking;
  }

  async updateStatus(id: number, status: string) {
    return this.bookingsRepository.updateStatus(id, status);
  }
}
