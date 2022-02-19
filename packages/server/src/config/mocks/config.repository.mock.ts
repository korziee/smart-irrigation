import { mockDeep } from 'jest-mock-extended';
import { ConfigRepository } from '../config.repository';

export const configRepositoryMockFactory = () => mockDeep<ConfigRepository>();
