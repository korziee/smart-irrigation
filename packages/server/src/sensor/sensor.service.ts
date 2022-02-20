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
}
