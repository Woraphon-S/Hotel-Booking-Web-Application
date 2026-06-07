import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly bookingsService: BookingsService,
  ) {}

  async processPayment(bookingId: number, userId: number, data: any) {
    const booking = await this.bookingsService.getBooking(bookingId);

    if (booking.user_id !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ชำระเงินสำหรับการจองนี้');
    }

    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking is not in pending status');
    }

    if (!data?.paymentMethod) {
      throw new BadRequestException('กรุณาระบุวิธีการชำระเงิน');
    }

    // Simulated payment gateway — the integration point where a real provider
    // (e.g. Stripe, Omise) would be charged and its result mapped to a status.
    const payment = await this.paymentsRepository.create({
      bookingId,
      amount: booking.total_price,
      paymentMethod: data.paymentMethod,
      transactionId: `TXN_${Date.now()}`,
      status: 'completed',
      paidAt: new Date(),
    });

    // Confirm the booking once payment succeeds
    await this.bookingsService.updateStatus(bookingId, 'confirmed');

    return payment;
  }
}
