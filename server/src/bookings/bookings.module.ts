import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsRepository } from './bookings.repository';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  providers: [BookingsService, BookingsRepository],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
