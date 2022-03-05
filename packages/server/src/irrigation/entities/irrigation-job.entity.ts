import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class IrrigationJob {
  @Field(() => ID, { description: 'Job ID' })
  id: string;

  @Field(() => ID, {
    description: 'The ID of the zone this job is for',
  })
  zoneId: string;

  @Field({ description: 'Whether or not the job is active' })
  active: boolean;

  @Field({
    description: 'Describes when the job started',
  })
  start: Date;

  @Field({
    description: 'Describes when the job should end',
  })
  end: Date;
}
