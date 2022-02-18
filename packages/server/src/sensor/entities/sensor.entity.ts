import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Sensor {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
