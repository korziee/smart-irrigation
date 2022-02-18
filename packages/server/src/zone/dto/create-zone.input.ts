import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateZoneInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
