export type Message = {
  type: string;
} & (
  | {
      type: 'UPDATE_SOLENOID_STATE';
      data: {
        open: boolean;
        solenoidId: string;
      };
    }
  | {
      type: 'PLACE_HOLDER';
      data: {
        nothing: boolean;
      };
    }
);
