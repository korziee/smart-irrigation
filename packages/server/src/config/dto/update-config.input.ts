import { CreateConfigInput } from './create-config.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateConfigInput extends PartialType(CreateConfigInput) {
  @Field(() => Int)
  id: number;
}
