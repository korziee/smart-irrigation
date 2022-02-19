import { mockDeep } from 'jest-mock-extended';
import { MicroControllerService } from '../micro-controller.service';

export const microControllerServiceMockFactory = () =>
  mockDeep<MicroControllerService>();
