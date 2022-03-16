import { Injectable } from '@nestjs/common';
import { PaginationParameters } from '../types/pagination-params';
import { SensorReading } from './entities/sensor-reading.entity';
import { SensorRepository } from './sensor.repository';

@Injectable()
export class SensorService {
  constructor(private readonly repository: SensorRepository) {}

  public async getReadingsForSensor(
    sensorId: string,
    pagination?: PaginationParameters,
  ): Promise<SensorReading[]> {
    return this.repository.findManySensorReadings({
      where: {
        sensor_id: sensorId,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: pagination.take,
      skip: pagination.skip,
    });
  }

  public async createReading(
    sensorId: string,
    reading: number,
  ): Promise<SensorReading> {
    return this.repository.createReading(sensorId, reading);
  }
}
