import { InputType, Field, ID, Float } from '@nestjs/graphql';

@InputType()
export class ControllerVoltageReadingInput {
  @Field(() => ID)
  controllerId: string;

  @Field(() => Float)
  volts: number;
}
