import { Test, TestingModule } from '@nestjs/testing';
import { MicroControllerResolver } from './micro-controller.resolver';
import { MicroControllerService } from './micro-controller.service';

describe('MicroControllerResolver', () => {
  let resolver: MicroControllerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicroControllerResolver, MicroControllerService],
    }).compile();

    resolver = module.get<MicroControllerResolver>(MicroControllerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
