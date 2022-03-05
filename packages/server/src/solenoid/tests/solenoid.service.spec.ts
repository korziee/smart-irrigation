import { Test, TestingModule } from '@nestjs/testing';
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

  describe('updateSolenoidState', () => {
    it('should update the database and return the updated solenoid', async () => {
      const solenoid: Solenoid = {
        id: 'solenoid-2',
        zoneId: 'zone-1',
        state: 'on',
      };

      solenoidRepository.updateState
        .calledWith('solenoid-2', 'on')
        .mockResolvedValue(solenoid);

      expect(
        await service.updateSolenoidState('solenoid-2', 'on'),
      ).toStrictEqual(solenoid);
    });
  });
});
