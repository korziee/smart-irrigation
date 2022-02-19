import { Test, TestingModule } from '@nestjs/testing';
import { ConfigRepository } from '../config.repository';
import { ConfigService } from '../config.service';
import { configRepositoryMockFactory } from '../mocks/config.repository.mock';

describe('ConfigService', () => {
  let service: ConfigService;
  let repository: ReturnType<typeof configRepositoryMockFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: ConfigRepository, useFactory: configRepositoryMockFactory },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
    repository = module.get(ConfigRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return the correct Config', async () => {
      const config = {
        id: 'config-1',
        soilSensorUpdateIntervalMs: 10,
        createdAt: new Date(),
      };

      repository.findById.calledWith('config-1').mockResolvedValue(config);

      expect(await service.findById('config-1')).toStrictEqual(config);
    });
  });
});
