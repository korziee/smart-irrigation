import { Test, TestingModule } from '@nestjs/testing';
import { MicroControllerService } from '../../micro-controller/micro-controller.service';
import { microControllerServiceMockFactory } from '../../micro-controller/mocks/micro-controller.service.mock';
import { Solenoid } from '../entities/solenoid.entity';
import { solenoidRepositoryMockFactory } from '../mocks/solenoid.repository.mock';
import { SolenoidRepository } from '../solenoid.repository';
import { SolenoidService } from '../solenoid.service';
import { zoneServiceMockFactory } from '../../zone/mocks/zone.service.mock';
import { ZoneService } from '../../zone/zone.service';
import { MicroController } from 'src/micro-controller/entities/micro-controller.entity';

describe('SolenoidService', () => {
  let service: SolenoidService;
  let solenoidRepository: ReturnType<typeof solenoidRepositoryMockFactory>;
  let microControllerService: ReturnType<
    typeof microControllerServiceMockFactory
  >;
  let zoneService: ReturnType<typeof zoneServiceMockFactory>;

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
    microControllerService = module.get(MicroControllerService);
    zoneService = module.get(ZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateSolenoidState', () => {
    it('should ask the controller service to send a state change message', async () => {
      zoneService.getControllerForZone.calledWith('zone-1').mockResolvedValue({
        id: 'controller-1',
      } as MicroController);

      solenoidRepository.updateState
        .calledWith('solenoid-1', 'off')
        .mockResolvedValue({
          id: 'solenoid-1',
          state: 'off',
          zoneId: 'zone-1',
        });

      await service.updateSolenoidState('solenoid-1', 'off');

      expect(microControllerService.sendControllerMessage).toHaveBeenCalledWith(
        'controller-1',
        {
          type: 'UPDATE_SOLENOID_STATE',
          data: {
            state: 'off',
          },
        },
      );
    });

    it('should update the database and return the updated solenoid', async () => {
      const solenoid: Solenoid = {
        id: 'solenoid-2',
        zoneId: 'zone-1',
        state: 'on',
      };

      zoneService.getControllerForZone.mockResolvedValue({
        id: 'controller-1',
      } as any);

      solenoidRepository.updateState
        .calledWith('solenoid-2', 'on')
        .mockResolvedValue(solenoid);

      expect(
        await service.updateSolenoidState('solenoid-2', 'on'),
      ).toStrictEqual(solenoid);
    });
  });
});
