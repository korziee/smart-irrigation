import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Zone {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
