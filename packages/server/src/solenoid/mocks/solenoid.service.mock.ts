import { mockDeep } from 'jest-mock-extended';
import { SolenoidService } from '../solenoid.service';

export const solenoidServiceMockFactory = () => mockDeep<SolenoidService>();
