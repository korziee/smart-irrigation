import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSolenoidInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
