import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { solenoid_control_mode } from '@smart-irrigation/prisma';
import type { solenoid_control_mode as SolenoidControlMode } from '@smart-irrigation/prisma';

registerEnumType(solenoid_control_mode, {
  name: 'SolenoidControlMode',
});

@ObjectType()
export class Solenoid {
  @Field(() => ID, { description: 'ID of the Solenoid' })
  id: string;

  @Field(() => ID, { description: 'Zone ID for which this solenoid resides' })
  zoneId: string;

  @Field(() => solenoid_control_mode, {
    description:
      'Describes if the solenoid is being controlled manually or automatically',
  })
  controlMode: SolenoidControlMode;

  @Field({ description: 'Describes if the solenoid is open or closed or not' })
  open: boolean;
}
