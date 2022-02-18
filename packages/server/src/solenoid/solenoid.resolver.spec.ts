import { Test, TestingModule } from '@nestjs/testing';
import { SolenoidResolver } from './solenoid.resolver';
import { SolenoidService } from './solenoid.service';

describe('SolenoidResolver', () => {
  let resolver: SolenoidResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolenoidResolver, SolenoidService],
    }).compile();

    resolver = module.get<SolenoidResolver>(SolenoidResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
