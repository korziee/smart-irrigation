import { Injectable } from '@nestjs/common';
import { Prisma, sensor, sensor_reading } from '@smart-irrigation/prisma';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';
import { SensorReading } from './entities/sensor-reading.entity';
import { Sensor } from './entities/sensor.entity';

@Injectable()
export class SensorRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapSensorDbRowToSensor(dbRow: sensor): Sensor {
    const sensor = new Sensor();

    sensor.id = dbRow.id;
    sensor.type = dbRow.type;
    sensor.zoneId = dbRow.zone_id;

    return sensor;
  }

  private mapSensorReadingDbRowToSensorReading(
    dbRow: sensor_reading,
  ): SensorReading {
    const reading = new SensorReading();

    reading.id = dbRow.id;
    reading.createdAt = dbRow.createdAt;
    reading.reading = dbRow.reading;
    reading.sensorId = dbRow.sensor_id;

    return reading;
  }

  public async createReading(
    sensorId: string,
    reading: number,
  ): Promise<SensorReading> {
    const newReading = await this.prisma.sensor_reading.create({
      data: {
        id: uuidv4(),
        reading,
        sensor_id: sensorId,
      },
    });

    return this.mapSensorReadingDbRowToSensorReading(newReading);
  }

  public async findManySensorReadings(
    query: Prisma.sensor_readingFindManyArgs,
  ): Promise<SensorReading[]> {
    const readings = await this.prisma.sensor_reading.findMany(query);

    return readings.map(this.mapSensorReadingDbRowToSensorReading);
  }
}
