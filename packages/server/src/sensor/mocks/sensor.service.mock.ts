import { mockDeep } from 'jest-mock-extended';
import { SensorService } from '../sensor.service';

export const sensorServiceMockFactory = () => mockDeep<SensorService>();
