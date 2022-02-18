import { Test, TestingModule } from '@nestjs/testing';
import { SensorResolver } from './sensor.resolver';
import { SensorService } from './sensor.service';

describe('SensorResolver', () => {
  let resolver: SensorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorResolver, SensorService],
    }).compile();

    resolver = module.get<SensorResolver>(SensorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
