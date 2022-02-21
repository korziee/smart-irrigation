import { Test, TestingModule } from '@nestjs/testing';
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
      ],
    }).compile();

    service = module.get<ZoneService>(ZoneService);
    zoneRepository = module.get(ZoneRepository);
    microControllerService = module.get(MicroControllerService);
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
});
