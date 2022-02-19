import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateConfigInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
