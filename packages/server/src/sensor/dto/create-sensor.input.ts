import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSensorInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
