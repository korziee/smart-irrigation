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

  describe('getSolenoidsForZone', () => {
    it('should return the correct solenoids for given zone', async () => {
      const mockSolenoids = [{ id: 1 }, { id: 2 }];

      solenoidRepository.findMany.mockResolvedValue(mockSolenoids as any);

      const solenoids = await service.getSolenoidsForZone('zone-1');

      expect(solenoidRepository.findMany).toHaveBeenCalledWith({
        where: {
          zone_id: 'zone-1',
        },
      });
      expect(solenoids).toStrictEqual(mockSolenoids);
    });
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
