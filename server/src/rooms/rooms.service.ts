import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly propertiesService: PropertiesService,
  ) {}

  async findByPropertyId(propertyId: number) {
    return this.roomsRepository.findByPropertyId(propertyId);
  }

  async findOne(id: number) {
    const room = await this.roomsRepository.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async create(userId: number, data: any) {
    const property = await this.propertiesService.findOne(data.propertyId);
    if (property.owner_id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }
    return this.roomsRepository.create(data);
  }

  async update(id: number, userId: number, data: any) {
    const room = await this.findOne(id);
    const property = await this.propertiesService.findOne(room.property_id);
    if (property.owner_id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }
    return this.roomsRepository.update(id, data);
  }

  async remove(id: number, userId: number) {
    const room = await this.findOne(id);
    const property = await this.propertiesService.findOne(room.property_id);
    if (property.owner_id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }
    return this.roomsRepository.delete(id);
  }
}
