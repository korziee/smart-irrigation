import { mockDeep } from 'jest-mock-extended';
import { SolenoidRepository } from '../solenoid.repository';

export const solenoidRepositoryMockFactory = () =>
  mockDeep<SolenoidRepository>();
