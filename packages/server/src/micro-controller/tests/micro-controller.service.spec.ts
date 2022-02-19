import { Test, TestingModule } from '@nestjs/testing';
import { MicroController } from '../entities/micro-controller.entity';
import { MicroControllerRepository } from '../micro-controller.repository';

import { MicroControllerService } from '../micro-controller.service';
import { microControllerRepositoryMock } from '../mocks/micro-controller.repository.mock';

describe('MicroControllerService', () => {
  let service: MicroControllerService;
  let repository: ReturnType<typeof microControllerRepositoryMock>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroControllerService,
        {
          provide: MicroControllerRepository,
          useFactory: microControllerRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<MicroControllerService>(MicroControllerService);
    repository = module.get(MicroControllerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleControllerOnlineHook', () => {
    it('should update the online status of a micro controller', async () => {
      await service.handleControllerOnlineHook('controller-1');

      expect(repository.update).toHaveBeenCalledWith('controller-1', {
        online: true,
      });
    });

    it('should return the newly updated controller', async () => {
      repository.update
        .calledWith('controller-1', expect.anything())
        .mockResolvedValue({
          id: 'controller-1',
          online: true,
        } as unknown as MicroController);

      const controller = await service.handleControllerOnlineHook(
        'controller-1',
      );

      expect(controller).toStrictEqual({ id: 'controller-1', online: true });
    });
  });
});
