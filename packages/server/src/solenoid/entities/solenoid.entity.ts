import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { solenoid_state } from '@smart-irrigation/prisma';
import type { solenoid_state as SolenoidState } from '@smart-irrigation/prisma';

registerEnumType(solenoid_state, {
  name: 'SolenoidState',
});

@ObjectType()
export class Solenoid {
  @Field(() => ID, { description: 'ID of the Solenoid' })
  id: string;

  @Field(() => ID, { description: 'Zone ID for which this solenoid resides' })
  zoneId: string;

  @Field(() => solenoid_state, { description: 'Solenoid state' })
  state: SolenoidState;
}
