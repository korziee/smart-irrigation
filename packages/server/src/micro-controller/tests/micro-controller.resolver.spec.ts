import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../config/config.service';
import { configServiceMockFactory } from '../../config/mocks/config.service.mock';
import { MicroControllerResolver } from '../micro-controller.resolver';
import { MicroControllerService } from '../micro-controller.service';
import { microControllerServiceMockFactory } from '../mocks/micro-controller.service.mock';
import { MicroController } from '../entities/micro-controller.entity';

describe('MicroControllerResolver', () => {
  let resolver: MicroControllerResolver;
  let microControllerService: ReturnType<
    typeof microControllerServiceMockFactory
  >;
  let configService: ReturnType<typeof configServiceMockFactory>;
  let mockContext: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroControllerResolver,
        {
          provide: MicroControllerService,
          useFactory: microControllerServiceMockFactory,
        },
        { provide: ConfigService, useFactory: configServiceMockFactory },
      ],
    }).compile();

    resolver = module.get<MicroControllerResolver>(MicroControllerResolver);
    microControllerService = module.get(MicroControllerService);
    configService = module.get(ConfigService);
    mockContext = {
      req: {
        socket: {
          remoteAddress: '1.1.1.1',
        },
      },
    };
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('controllerHeartbeat', () => {
    it('should call microControllerService.handleControllerHeartbeat with the correct controller ID', async () => {
      await resolver.controllerHeartbeat({ id: 'controller-1' }, mockContext);

      expect(
        microControllerService.handleControllerHeartbeat,
      ).toHaveBeenCalledWith('controller-1', '1.1.1.1');
    });

    it('should return the controller from microControllerService.handleControllerHeartbeat', async () => {
      microControllerService.handleControllerHeartbeat.mockResolvedValue({
        id: 'controller-1',
      } as any);

      const controller = await resolver.controllerHeartbeat(
        {
          id: 'controller-1',
        },
        mockContext,
      );

      expect(controller).toStrictEqual({ id: 'controller-1' });
    });
  });

  describe('config resolver', () => {
    it('should resolve the correct config for the microcontroller', async () => {
      const mockConfig = {
        createdAt: new Date(),
        id: 'config-1',
        soilSensorUpdateIntervalMs: 100,
      };

      configService.findById
        .calledWith('config-1')
        .mockResolvedValue(mockConfig);

      expect(
        await resolver.getConfigForController({
          configId: 'config-1',
        } as unknown as MicroController),
      ).toStrictEqual(mockConfig);
    });
  });
});
