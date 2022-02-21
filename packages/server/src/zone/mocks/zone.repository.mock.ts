import { mockDeep } from 'jest-mock-extended';
import { ZoneRepository } from '../zone.repository';

export const zoneRepositoryMockFactory = () => mockDeep<ZoneRepository>();
