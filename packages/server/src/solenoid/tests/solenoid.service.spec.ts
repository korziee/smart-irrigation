import { Test, TestingModule } from '@nestjs/testing';
import { solenoid_control_mode } from '@smart-irrigation/prisma';
import { Solenoid } from '../entities/solenoid.entity';
import { solenoidRepositoryMockFactory } from '../mocks/solenoid.repository.mock';
import { SolenoidRepository } from '../solenoid.repository';
import { SolenoidService } from '../solenoid.service';

describe('SolenoidService', () => {
  let service: SolenoidService;
  let solenoidRepository: ReturnType<typeof solenoidRepositoryMockFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolenoidService,
        {
          provide: SolenoidRepository,
          useFactory: solenoidRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<SolenoidService>(SolenoidService);
    solenoidRepository = module.get(SolenoidRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
