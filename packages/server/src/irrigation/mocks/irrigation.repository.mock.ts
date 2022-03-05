import { mockDeep } from 'jest-mock-extended';
import { IrrigationRepository } from '../irrigation.repository';

export const irrigationRepositoryMockFactory = () =>
  mockDeep<IrrigationRepository>();
