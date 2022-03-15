import { InputType, Field, ID } from '@nestjs/graphql';
import { solenoid_control_mode } from '@smart-irrigation/prisma';

@InputType()
export class UpdateSolenoidModeInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  zoneId: string;

  @Field(() => solenoid_control_mode)
  mode: solenoid_control_mode;

  @Field({ nullable: true })
  open?: boolean;
}
