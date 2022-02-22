import { Test, TestingModule } from '@nestjs/testing';
import { solenoidServiceMockFactory } from '../../solenoid/mocks/solenoid.service.mock';
import { SolenoidService } from '../../solenoid/solenoid.service';
import { MicroControllerService } from '../../micro-controller/micro-controller.service';
import { microControllerServiceMockFactory } from '../../micro-controller/mocks/micro-controller.service.mock';
import { zoneRepositoryMockFactory } from '../mocks/zone.repository.mock';
import { ZoneRepository } from '../zone.repository';
import { ZoneService } from '../zone.service';

describe('ZoneService', () => {
  let service: ZoneService;
  let zoneRepository: ReturnType<typeof zoneRepositoryMockFactory>;
  let microControllerService: ReturnType<
    typeof microControllerServiceMockFactory
  >;
  let solenoidService: ReturnType<typeof solenoidServiceMockFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZoneService,
        {
          provide: ZoneRepository,
          useFactory: zoneRepositoryMockFactory,
        },
        {
          provide: MicroControllerService,
          useFactory: microControllerServiceMockFactory,
        },
        {
          provide: SolenoidService,
          useFactory: solenoidServiceMockFactory,
        },
      ],
    }).compile();

    service = module.get<ZoneService>(ZoneService);
    zoneRepository = module.get(ZoneRepository);
    microControllerService = module.get(MicroControllerService);
    solenoidService = module.get(SolenoidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getControllerForZone', () => {
    it('should return the correct controller for the given zone', async () => {
      const zone = {
        id: 'zone-1',
        controllerId: 'controller-1',
      };

      const controller = {
        controllerId: 'controller-1',
      };

      zoneRepository.getZone.calledWith('zone-1').mockResolvedValue(zone);
      microControllerService.getControllerById
        .calledWith('controller-1')
        .mockResolvedValue(controller as any);

      expect(await service.getControllerForZone('zone-1')).toStrictEqual(
        controller,
      );
    });
  });

  describe('updateSolenoidState', () => {
    it('should tell the solenoid service to update the database state', async () => {
      const solenoid = {
        id: 'solenoid-1',
        zoneId: 'zone-1',
      };

      solenoidService.updateSolenoidState
        .calledWith('solenoid-1', 'on')
        .mockResolvedValue(solenoid as any);

      zoneRepository.getZone.calledWith('zone-1').mockResolvedValue({
        id: 'zone-1',
        controllerId: 'controller-1',
      });

      microControllerService.getControllerById
        .calledWith('controller-1')
        .mockResolvedValue({
          id: 'controller-1',
        } as any);

      expect(
        await service.updateSolenoidState('solenoid-1', 'on'),
      ).toStrictEqual(solenoid);
    });

    it('should ask the controller service to send a state change message', async () => {
      zoneRepository.getZone.calledWith('zone-1').mockResolvedValue({
        id: 'zone-1',
        controllerId: 'controller-1',
      });

      microControllerService.getControllerById
        .calledWith('controller-1')
        .mockResolvedValue({
          id: 'controller-1',
        } as any);

      solenoidService.updateSolenoidState.mockResolvedValue({
        id: 'solenoid-1',
        zoneId: 'zone-1',
      } as any);

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
  });
});
