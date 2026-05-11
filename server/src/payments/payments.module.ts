import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  providers: [PaymentsService, PaymentsRepository],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
