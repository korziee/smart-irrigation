import { Test, TestingModule } from '@nestjs/testing';
import { SensorReading } from '../entities/sensor-reading.entity';
import { sensorRepositoryMockFactory } from '../mocks/sensor.repository.mock';
import { SensorRepository } from '../sensor.repository';
import { SensorService } from '../sensor.service';

describe('SensorService', () => {
  let service: SensorService;
  let sensorRepository: ReturnType<typeof sensorRepositoryMockFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorService,
        { provide: SensorRepository, useFactory: sensorRepositoryMockFactory },
      ],
    }).compile();
    service = module.get<SensorService>(SensorService);
    sensorRepository = module.get(SensorRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the sensorRepository createReading method with the correct information', async () => {
    const reading: SensorReading = {
      id: 'sensor-reading-1',
      reading: 123,
      sensorId: 'sensor-1',
      createdAt: new Date(),
    };

    sensorRepository.createReading
      .calledWith('sensor-1', 123)
      .mockResolvedValue(reading);

    expect(await service.createReading('sensor-1', 123)).toStrictEqual(reading);
  });
});
