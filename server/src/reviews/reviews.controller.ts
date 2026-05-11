import { Controller, Get, Post, Put, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('property/:propertyId')
  async findByProperty(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.reviewsService.findByProperty(propertyId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.reviewsService.create(user.userId, data);
  }

  @Put(':id/reply')
  @UseGuards(JwtAuthGuard)
  async reply(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body('reply') reply: string,
  ) {
    return this.reviewsService.addReply(user.userId, id, reply);
  }
}
