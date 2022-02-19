import { mockDeep } from 'jest-mock-extended';
import { MicroControllerRepository } from '../micro-controller.repository';

export const microControllerRepositoryMock = () =>
  mockDeep<MicroControllerRepository>();
