import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      service: 'hotel-booking-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
