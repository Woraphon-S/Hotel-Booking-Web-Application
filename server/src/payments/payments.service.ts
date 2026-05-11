import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly bookingsService: BookingsService,
  ) {}

  async processPayment(bookingId: number, data: any) {
    const booking = await this.bookingsService.getBooking(bookingId);
    
    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking is not in pending status');
    }

    // Mock Payment Logic
    // In a real app, you'd call a payment gateway API here (Stripe, Omise, etc.)
    const isSuccess = true; // Assume success for mock

    if (isSuccess) {
      const payment = await this.paymentsRepository.create({
        bookingId,
        amount: booking.total_price,
        paymentMethod: data.paymentMethod,
        transactionId: `MOCK_TX_${Date.now()}`,
        status: 'completed',
        paidAt: new Date(),
      });

      // Update Booking Status
      await this.bookingsService.updateStatus(bookingId, 'confirmed');

      return payment;
    } else {
      await this.paymentsRepository.create({
        bookingId,
        amount: booking.total_price,
        paymentMethod: data.paymentMethod,
        status: 'failed',
      });
      throw new BadRequestException('Payment failed');
    }
  }

  async getPayment(bookingId: number) {
    return this.paymentsRepository.findByBookingId(bookingId);
  }
}
