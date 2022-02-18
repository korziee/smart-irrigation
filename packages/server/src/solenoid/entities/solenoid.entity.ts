import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Solenoid {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
