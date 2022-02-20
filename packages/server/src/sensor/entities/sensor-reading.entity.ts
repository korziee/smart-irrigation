import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SensorReading {
  @Field(() => ID, { description: 'Sensor Reading ID' })
  id: string;

  @Field(() => ID, {
    description: 'The ID of the sensor from which this reading came',
  })
  sensorId: string;

  @Field({ description: 'When this reading was created' })
  createdAt: Date;

  @Field({ description: 'The actual sensor reading' })
  reading: number;
}
