import { mockDeep } from 'jest-mock-extended';
import { ConfigService } from '../config.service';

export const configServiceMockFactory = () => mockDeep<ConfigService>();
