import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import request from 'supertest';

import { AppModule } from '../../app.module';

describe('Sensor Module E2E', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a sensor reading', async () => {
    const mutation = () => `
      mutation SensorReading($sensorReadingInput: SensorReadingInput!) {
        sensorReading(sensorReadingInput: $sensorReadingInput) {
          id
          sensorId
          createdAt
          reading
        }
      }
    `;

    const prisma = app.get<PrismaService>(PrismaService);

    const countBeforeInsert = await prisma.sensor_reading.count();

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation(),
        variables: {
          sensorReadingInput: {
            sensorId: 'sensor-1',
            reading: 123,
          },
        },
      });

    expect(response.ok).toBe(true);
    expect(response.body.data.sensorReading.reading).toBe(123);
    expect(response.body.data.sensorReading.sensorId).toBe('sensor-1');

    // validate the count has increased
    expect(await prisma.sensor_reading.count()).toBe(countBeforeInsert + 1);
  });
});
