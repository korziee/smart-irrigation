import { Test, TestingModule } from '@nestjs/testing';
import { SolenoidService } from '../../solenoid/solenoid.service';
import { MicroControllerService } from '../../micro-controller/micro-controller.service';
import { ZoneRepository } from '../zone.repository';
import { ZoneResolver } from '../zone.resolver';
import { ZoneService } from '../zone.service';

describe('ZoneResolver', () => {
  let resolver: ZoneResolver;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       ZoneResolver,
  //       ZoneService,
  //       ZoneRepository,
  //       SolenoidService,
  //       MicroControllerService,
  //     ],
  //   }).compile();

  //   resolver = module.get<ZoneResolver>(ZoneResolver);
  // });

  // it('should be defined', () => {
  //   expect(resolver).toBeDefined();
  // });

  it.todo('tood');
});
