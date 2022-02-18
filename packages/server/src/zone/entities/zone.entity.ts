import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Zone {
  @Field(() => ID, { description: 'Zone ID' })
  id: string;

  @Field(() => ID, {
    description: 'Controller ID for which this zone is controlled by',
  })
  controllerId: string;
}
