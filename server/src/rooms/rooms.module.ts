import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [PropertiesModule],
  providers: [RoomsService, RoomsRepository],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
