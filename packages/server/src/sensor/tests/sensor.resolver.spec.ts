import { Test, TestingModule } from '@nestjs/testing';
import { SensorReading } from '../entities/sensor-reading.entity';
import { sensorServiceMockFactory } from '../mocks/sensor.service.mock';
import { SensorResolver } from '../sensor.resolver';
import { SensorService } from '../sensor.service';

describe('SensorResolver', () => {
  let resolver: SensorResolver;
  let sensorService: ReturnType<typeof sensorServiceMockFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorResolver,
        { provide: SensorService, useFactory: sensorServiceMockFactory },
      ],
    }).compile();
    resolver = module.get<SensorResolver>(SensorResolver);
    sensorService = module.get(SensorService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('sensorReading', () => {
    it('should call createReading with the correct information', async () => {
      const reading: SensorReading = {
        id: 'sensor-reading-1',
        reading: 123,
        sensorId: 'sensor-1',
        createdAt: new Date(),
      };

      sensorService.createReading
        .calledWith('sensor-1', 123)
        .mockResolvedValue(reading);

      expect(
        await resolver.sensorReading({
          sensorId: 'sensor-1',
          reading: 123,
        }),
      ).toStrictEqual(reading);
    });
  });
});
