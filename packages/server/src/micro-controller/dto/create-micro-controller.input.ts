import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMicroControllerInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
