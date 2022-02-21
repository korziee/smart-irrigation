import { Solenoid } from '../../solenoid/entities/solenoid.entity';

export type Message = {
  type: string;
} & (
  | {
      type: 'UPDATE_SOLENOID_STATE';
      data: {
        state: Solenoid['state'];
      };
    }
  | {
      type: 'PLACE_HOLDER';
      data: {
        nothing: boolean;
      };
    }
);
