import { Test, TestingModule } from '@nestjs/testing';
import { MicroControllerService } from './micro-controller.service';

describe('MicroControllerService', () => {
  let service: MicroControllerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicroControllerService],
    }).compile();

    service = module.get<MicroControllerService>(MicroControllerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
