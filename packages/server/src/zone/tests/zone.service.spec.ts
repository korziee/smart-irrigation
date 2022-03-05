import { Test, TestingModule } from '@nestjs/testing';
import { solenoid_state } from '@smart-irrigation/prisma';
import { solenoidServiceMockFactory } from '../../solenoid/mocks/solenoid.service.mock';
import { SolenoidService } from '../../solenoid/solenoid.service';
import { MicroControllerService } from '../../micro-controller/micro-controller.service';
import { microControllerServiceMockFactory } from '../../micro-controller/mocks/micro-controller.service.mock';
import { zoneRepositoryMockFactory } from '../mocks/zone.repository.mock';
import { ZoneRepository } from '../zone.repository';
import { ZoneService } from '../zone.service';
import { solenoidRepositoryMockFactory } from '../../solenoid/mocks/solenoid.repository.mock';
import { SolenoidRepository } from '../../solenoid/solenoid.repository';
import { SensorRepository } from '../../sensor/sensor.repository';
import { sensorRepositoryMockFactory } from '../../sensor/mocks/sensor.repository.mock';

describe('ZoneService', () => {
  let service: ZoneService;
  let zoneRepository: ReturnType<typeof zoneRepositoryMockFactory>;
  let microControllerService: ReturnType<
    typeof microControllerServiceMockFactory
  >;
  let solenoidService: ReturnType<typeof solenoidServiceMockFactory>;
  let solenoidRepository: ReturnType<typeof solenoidRepositoryMockFactory>;

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
        {
          provide: SolenoidRepository,
          useFactory: solenoidRepositoryMockFactory,
        },
        {
          provide: SensorRepository,
          useFactory: sensorRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ZoneService>(ZoneService);
    zoneRepository = module.get(ZoneRepository);
    microControllerService = module.get(MicroControllerService);
    solenoidService = module.get(SolenoidService);
    solenoidRepository = module.get(SolenoidRepository);
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

      zoneRepository.findOne.calledWith('zone-1').mockResolvedValue(zone);
      microControllerService.getControllerById
        .calledWith('controller-1')
        .mockResolvedValue(controller as any);

      expect(await service.getControllerForZone('zone-1')).toStrictEqual(
        controller,
      );
    });
  });

  describe('updateAllSolenoidsInZone', () => {
    it('should tell the solenoid service to update the database state for each solenoid', async () => {
      const solenoids = [
        {
          id: 'solenoid-1',
          zoneId: 'zone-1',
          state: solenoid_state.off,
        },
        {
          id: 'solenoid-2',
          zoneId: 'zone-1',
          state: solenoid_state.off,
        },
      ];

      solenoidRepository.findMany.mockResolvedValue(solenoids);

      solenoidService.updateSolenoidState
        .calledWith('solenoid-1', 'on')
        .mockResolvedValue(solenoids[0]);

      solenoidService.updateSolenoidState
        .calledWith('solenoid-2', 'on')
        .mockResolvedValue(solenoids[1]);

      zoneRepository.findOne.calledWith('zone-1').mockResolvedValue({
        id: 'zone-1',
        controllerId: 'controller-1',
      });

      microControllerService.getControllerById
        .calledWith('controller-1')
        .mockResolvedValue({
          id: 'controller-1',
        } as any);

      expect(
        await service.updateAllSolenoidsInZone('zone-1', 'on'),
      ).toStrictEqual(solenoids);

      expect(solenoidRepository.findMany).toHaveBeenCalledWith({
        where: {
          zone_id: 'zone-1',
        },
      });
    });

    it('should ask the controller service to send a state change message for each solenoid', async () => {
      const solenoids = [
        {
          id: 'solenoid-1',
          zoneId: 'zone-1',
          state: solenoid_state.off,
        },
        {
          id: 'solenoid-2',
          zoneId: 'zone-1',
          state: solenoid_state.off,
        },
      ];

      zoneRepository.findOne.calledWith('zone-1').mockResolvedValue({
        id: 'zone-1',
        controllerId: 'controller-1',
      });

      microControllerService.getControllerById
        .calledWith('controller-1')
        .mockResolvedValue({
          id: 'controller-1',
        } as any);

      solenoidRepository.findMany.mockResolvedValue(solenoids);

      await service.updateAllSolenoidsInZone('zone-1', 'off');

      for (const solenoid of solenoids) {
        expect(
          microControllerService.sendControllerMessage,
        ).toHaveBeenCalledWith('controller-1', {
          type: 'UPDATE_SOLENOID_STATE',
          data: {
            state: 'off',
            solenoidId: solenoid.id,
          },
        });
      }
    });
  });
});
