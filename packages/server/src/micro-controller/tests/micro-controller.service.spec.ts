import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, MockProxy } from 'jest-mock-extended';

import { MicroController } from '../entities/micro-controller.entity';
import { MicroControllerRepository } from '../micro-controller.repository';
import { MicroControllerService } from '../micro-controller.service';
import { microControllerRepositoryMock } from '../mocks/micro-controller.repository.mock';
import { Message } from '../types/Message';

describe('MicroControllerService', () => {
  let service: MicroControllerService;
  let repository: ReturnType<typeof microControllerRepositoryMock>;
  let httpService: MockProxy<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroControllerService,
        {
          provide: MicroControllerRepository,
          useFactory: microControllerRepositoryMock,
        },
        {
          provide: HttpService,
          useFactory: mockDeep,
        },
      ],
    }).compile();

    service = module.get<MicroControllerService>(MicroControllerService);
    repository = module.get(MicroControllerRepository);
    httpService = module.get(HttpService);
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

  describe('sendControllerMessage', () => {
    it.each<[Message['type'], string]>([
      ['UPDATE_SOLENOID_STATE', '/update-solenoid'],
      ['PLACE_HOLDER', '/placeholder'],
    ])(
      'should send an %p message to the correct micro controller endpoint',
      async (type, endpoint) => {
        repository.findById.mockResolvedValue({
          ipAddress: '1.2.3.4',
        } as any);

        await service.sendControllerMessage('controller-1', {
          data: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            something: true,
          },
          type,
        });

        expect(httpService.post).toHaveBeenCalledWith(
          `http://1.2.3.4${endpoint}`,
          {
            something: true,
          },
        );
      },
    );
  });

  describe('getControllerById', () => {
    it('returns the correct controller for the ID', async () => {
      const controller = { id: 'controller-1' };

      repository.findById
        .calledWith('controller-1')
        .mockResolvedValue(controller as any);

      expect(await service.getControllerById('controller-1')).toStrictEqual(
        controller,
      );
    });
  });
});
