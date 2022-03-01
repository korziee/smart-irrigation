import { Injectable } from '@nestjs/common';
import { SensorReading } from './entities/sensor-reading.entity';
import { SensorRepository } from './sensor.repository';

@Injectable()
export class SensorService {
  constructor(private readonly repository: SensorRepository) {}

  public async createReading(
    sensorId: string,
    reading: number,
  ): Promise<SensorReading> {
    return this.repository.createReading(sensorId, reading);
  }

  public async getSensorReadingsForZone(
    zoneId: string,
    options: {
      take?: number;
      from?: Date;
      to?: Date;
      order?: 'asc' | 'desc';
    },
  ): Promise<SensorReading[]> {
    const readings = await this.repository.findManySensorReadings({
      where: {
        sensor: {
          zone_id: zoneId,
        },
        createdAt: {
          gte: options.from,
          lte: options.to,
        },
      },
      orderBy: {
        createdAt: options.order,
      },
      take: options.take,
    });

    return readings;
  }
}
