import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class SensorReadingInput {
  @Field(() => ID)
  sensorId: string;

  @Field(() => Int)
  reading: number;
}
