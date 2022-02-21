import { mockDeep } from 'jest-mock-extended';
import { ZoneService } from '../zone.service';

export const zoneServiceMockFactory = () => mockDeep<ZoneService>();
