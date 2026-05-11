import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.bookingsService.createBooking(user.userId, data);
  }

  @Get('my')
  async getMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.getUserBookings(user.userId);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.getBooking(id);
  }
}
