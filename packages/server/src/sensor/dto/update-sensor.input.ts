import { CreateSensorInput } from './create-sensor.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSensorInput extends PartialType(CreateSensorInput) {
  @Field(() => Int)
  id: number;
}
