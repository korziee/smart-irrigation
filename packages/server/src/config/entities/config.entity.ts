import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class DevMode {
  @Field()
  enabled: boolean;

  @Field()
  ipAddress?: string;
}

@ObjectType()
export class Config {
  @Field(() => ID, { description: 'Config ID' })
  id: string;

  @Field({
    description:
      'Describes how often the controller should send sensor updates',
  })
  soilSensorUpdateIntervalMs: number;

  @Field()
  devMode: DevMode;

  @Field({
    description:
      'Describes how often the controller should send sensor updates',
  })
  createdAt: Date;
}
