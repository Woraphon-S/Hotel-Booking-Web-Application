import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { BookingsModule } from '../bookings/bookings.module';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [BookingsModule, PropertiesModule],
  providers: [ReviewsService, ReviewsRepository],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
