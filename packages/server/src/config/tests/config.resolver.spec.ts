import { Test, TestingModule } from '@nestjs/testing';
import { ConfigResolver } from '../config.resolver';
import { ConfigService } from '../config.service';
import { configServiceMockFactory } from '../mocks/config.service.mock';

describe('ConfigResolver', () => {
  let resolver: ConfigResolver;
  let configService: ReturnType<typeof configServiceMockFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigResolver,
        { provide: ConfigService, useFactory: configServiceMockFactory },
      ],
    }).compile();

    resolver = module.get<ConfigResolver>(ConfigResolver);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
