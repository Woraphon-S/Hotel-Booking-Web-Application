import { Controller, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':bookingId')
  async pay(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.paymentsService.processPayment(bookingId, user.userId, data);
  }
}
