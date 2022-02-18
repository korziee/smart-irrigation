import { CreateMicroControllerInput } from './create-micro-controller.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMicroControllerInput extends PartialType(CreateMicroControllerInput) {
  @Field(() => Int)
  id: number;
}
