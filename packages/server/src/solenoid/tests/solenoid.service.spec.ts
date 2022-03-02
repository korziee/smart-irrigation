import { Test, TestingModule } from '@nestjs/testing';
import { MicroControllerService } from '../../micro-controller/micro-controller.service';
import { microControllerServiceMockFactory } from '../../micro-controller/mocks/micro-controller.service.mock';
import { Solenoid } from '../entities/solenoid.entity';
import { solenoidRepositoryMockFactory } from '../mocks/solenoid.repository.mock';
import { SolenoidRepository } from '../solenoid.repository';
import { SolenoidService } from '../solenoid.service';
import { zoneServiceMockFactory } from '../../zone/mocks/zone.service.mock';
import { ZoneService } from '../../zone/zone.service';

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
        {
          provide: MicroControllerService,
          useFactory: microControllerServiceMockFactory,
        },
        {
          provide: ZoneService,
          useFactory: zoneServiceMockFactory,
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
    it('should return the correct solenoids for given zone');
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
