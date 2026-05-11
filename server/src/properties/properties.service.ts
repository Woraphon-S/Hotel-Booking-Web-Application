import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PropertiesRepository } from './properties.repository';

@Injectable()
export class PropertiesService {
  constructor(private readonly propertiesRepository: PropertiesRepository) {}

  async findAll(filters: any) {
    return this.propertiesRepository.findAll(filters);
  }

  async findOne(id: number) {
    const property = await this.propertiesRepository.findById(id);
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async create(data: any) {
    return this.propertiesRepository.create(data);
  }

  async update(id: number, userId: number, data: any) {
    const property = await this.findOne(id);
    if (property.owner_id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }
    return this.propertiesRepository.update(id, data);
  }

  async remove(id: number, userId: number) {
    const property = await this.findOne(id);
    if (property.owner_id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }
    return this.propertiesRepository.delete(id);
  }

  async removeImage(propertyId: number, imageId: number, userId: number) {
    const property = await this.findOne(propertyId);
    if (property.owner_id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }
    return this.propertiesRepository.deleteImage(imageId);
  }
}
