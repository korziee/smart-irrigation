import { CreateSolenoidInput } from './create-solenoid.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSolenoidInput extends PartialType(CreateSolenoidInput) {
  @Field(() => Int)
  id: number;
}
