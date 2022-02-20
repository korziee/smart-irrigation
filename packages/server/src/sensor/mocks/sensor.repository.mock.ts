import { mockDeep } from 'jest-mock-extended';
import { SensorRepository } from '../sensor.repository';

export const sensorRepositoryMockFactory = () => mockDeep<SensorRepository>();
